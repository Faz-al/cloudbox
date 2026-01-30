
/**
 * STORAGE QUOTA ENFORCEMENT
 * - Uses user.usedStorage + user.storageLimit (for progress bar)
 * - DO NOT replace with aggregation (HWC)
 * - Required for paid plans and upgraes 
 * 
 
 */


const noCache = (res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
};



const AuditLog = require("../models/AuditLog");

const bcrypt = require("bcryptjs");


const fs = require("fs");
const File = require("../models/File");
const User = require("../models/User");
const crypto = require("crypto");
const mongoose = require("mongoose");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const s3 = require("../config/storage");



const isVaultUnlocked = (user) => {
  if (!user.vaultUnlockedAt) return false;
  return Date.now() - user.vaultUnlockedAt.getTime() < 1000 * 60 * 30; // 30 min
};

const isVaultSetup = (user) => {
  return (
    typeof user.vaultPinHash === "string" &&
    user.vaultPinHash.length > 20
  );
};





const softDeleteRecursive = async (fileId, userId) => {
  const file = await File.findOne({ _id: fileId, user: userId });
  if (!file || file.isDeleted) return;

  await File.updateOne(
  { _id: file._id },
  {
    $set: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
      originalParent: file.parent ?? null,
    },
  }
);

await AuditLog.create({
  user: userId,
  file: file._id,
  action: "deleted",
});


  if (file.isFolder) {
    const children = await File.find({
      parent: file._id,
      user: userId,
      isDeleted: false,
    });

    for (const child of children) {
      await softDeleteRecursive(child._id, userId);
    }
  }
};





const permanentDeleteRecursive = async (fileId, userId) => {
  const file = await File.findOne({ _id: fileId, user: userId });
  if (!file) return;

  // If folder → delete children first
  if (file.isFolder) {
    const children = await File.find({
      parent: file._id,
      user: userId,
    });

    for (const child of children) {
      await permanentDeleteRecursive(child._id, userId);
    }
  }

  // If file → delete physical object
  if (!file.isFolder) {
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: file.key,
        })
      );

      // update storage usage
      const user = await User.findById(userId);
      if (user) {
        user.usedStorage = Math.max(0, user.usedStorage - (file.size || 0));
        await user.save();
      }
    } catch (err) {
      console.error("S3 DELETE ERROR:", err);
    }
  }

  // remove DB record
  await File.deleteOne({ _id: file._id });
};


/* ================= PUBLIC SHARING (PHASE 1) ================= */

const getShareStatus = async (req, res) => {
  noCache(res);


  const userId = req.user?.id || req.user?._id;
  if (!userId) return res.status(401).end();

  const file = await File.findOne({
    _id: req.params.id,
    user: userId,
    isDeleted: false,
  });

  if (!file) return res.status(404).json({ message: "File not found" });

  res.json({
    isShared: file.isShared,
    shareEnabled: file.shareEnabled !== false,
    token: file.shareToken || null,
    url: file.shareToken
      ? `${process.env.FRONTEND_URL}/view/${file.shareToken}`
      : null,
  });
};


const toggleShare = async (req, res) => {
  noCache(res);

  const userId = req.user?.id || req.user?._id;
  if (!userId) return res.status(401).end();

  const file = await File.findOne({
    _id: req.params.id,
    user: userId,
    isDeleted: false,
  });

  if (!file || !file.isShared || !file.shareToken) {
    return res.status(400).json({ message: "File not shared" });
  }

  file.shareEnabled = !file.shareEnabled;
  await file.save();

  res.json({
    shareEnabled: file.shareEnabled,
  });
};










/* Generate share link */



const shareFile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).end();

    const file = await File.findOne({
      _id: req.params.id,
      user: userId,
      isDeleted: false,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!file.shareToken) {
      file.shareToken = crypto.randomBytes(24).toString("hex");
      file.isShared = true;
      await file.save();
    }

    res.json({
      token: file.shareToken,
      url: `${process.env.FRONTEND_URL}/view/${file.shareToken}`,
    });
  } catch (err) {
    console.error("SHARE ERROR:", err);
    res.status(500).json({ message: "Share failed" });
  }
};

const getSharedFile = async (req, res) => {
  noCache(res);

  try {
    const file = await File.findOne({
      shareToken: req.params.token,
      isShared: true,
      isDeleted: false,
    });


    if (!file) return res.status(404).end();

    if (file.shareEnabled === false) {
      return res.status(410).end();
    }

    const data = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: file.key,
      })
    );

    res.setHeader("Content-Type", file.type);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.name}"`
    );

    data.Body.pipe(res);
  } catch (err) {
    console.error("PUBLIC SHARE ERROR:", err);
    res.status(404).end();
  }
};








// ===== PUBLIC FILE INFO =====
const getSharedFileInfo = async (req, res) => {
  noCache(res);

  try {
    const file = await File.findOne({
      shareToken: req.params.token,
      isShared: true,
      isDeleted: false,
    });


    if (!file) return res.status(404).end();

    if (file.shareEnabled === false) {
      return res.status(410).json({ disabled: true });
    }

    res.json({
      name: file.name,
      type: file.type,
      size: file.size,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch file info" });
  }
};





// ===== PUBLIC PREVIEW (INLINE STREAM) =====
// ===== PUBLIC PREVIEW (INLINE STREAM + RANGE) =====
const previewSharedFile = async (req, res) => {
  noCache(res);

  try {
    const file = await File.findOne({
      shareToken: req.params.token,
      isShared: true,
      isDeleted: false,
    });

    if (!file) return res.status(404).end();
    if (file.shareEnabled === false) return res.status(410).end();

    const range = req.headers.range;

      // 🔴 iOS SAFARI: handle HEAD request WITHOUT hitting S3
if (req.method === "HEAD") {
  res.status(200);
  res.setHeader("Content-Type", file.type);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Length", file.size);
  return res.end();
}




    const params = {
      Bucket: process.env.R2_BUCKET,
      Key: file.key,
    };

    if (range) {
      params.Range = range;
    }

    const data = await s3.send(new GetObjectCommand(params));

      




    // REQUIRED FOR iOS
    res.status(range ? 206 : 200);
    res.setHeader("Content-Type", file.type);
    res.setHeader("Accept-Ranges", "bytes");

    if (data.ContentRange) {
      res.setHeader("Content-Range", data.ContentRange);
    }

    if (data.ContentLength) {
      res.setHeader("Content-Length", data.ContentLength);
    }

    res.setHeader("Content-Disposition", "inline");
      res.setHeader("Cache-Control", "no-store");

    data.Body.pipe(res);
  } catch (err) {
    console.error("PREVIEW SHARED ERROR:", err);
    res.status(404).end();
  }
};









/* ===== LIST FILES ===== */
/* ===== LIST FILES ===== */


const listFiles = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).end();

    const parent =
      req.query.parent && req.query.parent !== "null"
        ? req.query.parent
        : null;

    const files = await File.find({
      user: userId,
      isDeleted: false,
      isVaulted: false,

      parent: parent,
    }).sort({ isFolder: -1, createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("LIST FILES ERROR:", err);
    res.status(500).json({ message: "Failed to list files" });
  }
};



/* ===== PREVIEW FILE ===== */
/* ===== PREVIEW FILE (RANGE STREAMING) ===== */
const previewFile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).end();

    const file = await File.findOne({
      _id: req.params.id,
      user: userId,
      isDeleted: false,
    });

    if (!file) return res.status(404).end();

    const range = req.headers.range;


    // 🔴 iOS SAFARI: handle HEAD request WITHOUT hitting S3
if (req.method === "HEAD") {
  res.status(200);
  res.setHeader("Content-Type", file.type);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Length", file.size);
  return res.end();
}







    // iOS REQUIRES range for video
    const params = {
      Bucket: process.env.R2_BUCKET,
      Key: file.key,
    };

    if (range) {
      params.Range = range;
    }

    const data = await s3.send(new GetObjectCommand(params));


   



    // REQUIRED HEADERS
    res.status(range ? 206 : 200);
    res.setHeader("Content-Type", file.type);
    res.setHeader("Accept-Ranges", "bytes");

    if (data.ContentRange) {
      res.setHeader("Content-Range", data.ContentRange);
    }

    if (data.ContentLength) {
      res.setHeader("Content-Length", data.ContentLength);
    }

    res.setHeader("Content-Disposition", "inline");
      res.setHeader("Cache-Control", "no-store");

    data.Body.pipe(res);
  } catch (err) {
    console.error("PREVIEW FILE ERROR:", err);
    res.status(404).end();
  }
};


/* ===== UPLOAD FILE ===== */
/* ===== UPLOAD FILE ===== */
const uploadFile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const usedBytes = user.usedStorage || 0;

    if (usedBytes + req.file.size > user.storageLimit) {
      return res.status(403).json({
        message: "Storage limit exceeded. Upgrade to continue.",
      });
    }

    const key = crypto.randomBytes(16).toString("hex");

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: fs.createReadStream(req.file.path),
        ContentType: req.file.mimetype,
      })
    );

    fs.unlinkSync(req.file.path);


    const parent =
      req.body.parent && req.body.parent !== "null"
        ? req.body.parent
        : null;

    const file = await File.create({
      user: userId,
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      parent,
      isFolder: false,
      key,
    });

    user.usedStorage += req.file.size;
    await user.save();

    res.status(201).json(file);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};


/* ===== DOWNLOAD FILE ===== */
const downloadFile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).end();

    const file = await File.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const data = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: file.key,
      })
    );

    res.setHeader("Content-Type", file.type);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.name}"`
    );

    data.Body.pipe(res);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Download failed" });
  }
};

/* ===== DELETE FILE ===== */
/* ===== DELETE FILE (SOFT → TRASH) ===== */

/* ===== DELETE FILE (SOFT → TRASH) ===== */
const deleteFile = async (req, res) => {
  try {
    // 🛑 guard: block non-objectId like "trash"
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid file id" });
    }

    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).end();

    const file = await File.findOne({
      _id: req.params.id,
      user: userId,
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await softDeleteRecursive(file._id, userId);

    // 🔥 ensure DB write is flushed
    await File.findOne({ _id: file._id });

    res.json({ message: "Moved to trash" });


    
  } catch (err) {
    console.error("TRASH ERROR:", err);
    res.status(500).json({ message: "Trash failed" });
  }
};



/* ===== RENAME FILE ===== */
const renameFile = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  if (!userId) return res.status(401).end();

  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Invalid filename" });
  }

  const file = await File.findOne({
    _id: req.params.id,
    user: userId,
  });

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  file.name = name.trim();
  await file.save();

  res.json(file);
};

/* ===== CREATE FOLDER ===== */
const createFolder = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  if (!userId) return res.status(401).end();

  const { name, parent = null } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Folder name required" });
  }

  const folder = await File.create({
    user: userId,
    name,
    size: 0,
    type: "folder",
    key: `folder-${Date.now()}`,
    parent: parent && parent !== "null" ? parent : null,
    isFolder: true,
  });

  res.status(201).json(folder);
};


/* ===== LIST TRASH ===== */





/* ===== DELETE FOREVER (PERMANENT) ===== */
const deleteForever = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).end();

    const file = await File.findOne({
      _id: req.params.id,
      user: userId,
      isDeleted: true,
    });

    if (!file) {
      return res.status(404).json({ message: "Item not found in trash" });
    }

    await permanentDeleteRecursive(file._id, userId);

    res.json({ message: "Deleted permanently" });
  } catch (err) {
    console.error("PERMANENT DELETE ERROR:", err);
    res.status(500).json({ message: "Permanent delete failed" });
  }
};




/* RestorefromTrash  */

const restoreFromTrash = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).end();

    const file = await File.findOne({
      _id: req.params.id,
      user: userId,
      isDeleted: true,
    });

    if (!file) {
      return res.status(404).json({ message: "Not found in trash" });
    }

    const parentExists = file.originalParent
      ? await File.exists({ _id: file.originalParent, isDeleted: false })
      : true;

    await File.updateOne(
      { _id: file._id },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          parent: parentExists ? file.originalParent : null,
          originalParent: null,
        },
      }
    );

    await AuditLog.create({
      user: userId,
      file: file._id,
      action: "restored",
    });

    res.json({ message: "Restored" });
  } catch (err) {
    res.status(500).json({ message: "Restore failed" });
  }
};


/* List Trash  */

const listTrash = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).end();

    const files = await File.find({
      user: userId,
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("TRASH LIST ERROR:", err);
    res.status(500).json({ message: "Failed to fetch trash" });
  }
};


/* Vault Controller */

const setupVaultPin = async (req, res) => {
  const userId = req.user?.id;
  const { pin } = req.body;

  if (!pin || pin.length < 4) {
    return res.status(400).json({ message: "Invalid PIN" });
  }

  const user = await User.findById(userId);

  if (isVaultSetup(user)) {
    return res.status(400).json({ message: "Vault already setup" });
  }

  const hash = await bcrypt.hash(pin, 10);
  user.vaultPinHash = hash;

  // ❌ DO NOT unlock here
  user.vaultUnlockedAt = null;

  await user.save();
  res.json({ message: "Vault PIN set" });
};





const unlockVault = async (req, res) => {
  const userId = req.user?.id;
  const { pin } = req.body;

  const user = await User.findById(userId);

  if (!isVaultSetup(user)) {
    return res.status(400).json({ message: "Vault not set" });
  }

  const ok = await bcrypt.compare(pin, user.vaultPinHash);
  if (!ok) {
    return res.status(401).json({ message: "Incorrect PIN" });
  }

  user.vaultUnlockedAt = new Date();
  await user.save();

  res.json({ message: "Vault unlocked" });
};



const vaultFile = async (req, res) => {
  const userId = req.user?.id;
  const user = await User.findById(userId);

  if (!isVaultUnlocked(user)) {
    return res.status(403).json({ message: "Vault locked" });
  }


  const file = await File.findOne({
    _id: req.params.id,
    user: userId,
    isDeleted: false,
  });

  if (!file) return res.status(404).end();

  await File.updateOne(
    { _id: file._id },
    {
      $set: {
        isVaulted: true,
        vaultedAt: new Date(),
        vaultParent: file.parent,
        parent: null,
      },
    }
  );

  res.json({ message: "Moved to vault" });
};


const unvaultFile = async (req, res) => {
  const userId = req.user?.id;
  const user = await User.findById(userId);

  if (!isVaultUnlocked(user)) {
    return res.status(403).json({ message: "Vault locked" });
  }

  const file = await File.findOne({
    _id: req.params.id,
    user: userId,
    isVaulted: true,
  });

  if (!file) return res.status(404).end();

  await File.updateOne(
    { _id: file._id },
    {
      $set: {
        isVaulted: false,
        parent: file.vaultParent,
        vaultParent: null,
        vaultedAt: null,
      },
    }
  );

  res.json({ message: "Removed from vault" });
};



const listVault = async (req, res) => {
  const userId = req.user?.id;
  const user = await User.findById(userId);

  // 🔥 Vault NOT SET
 if (!isVaultSetup(user)) {
  return res.status(400).json({ message: "Vault not set" });
}

if (!isVaultUnlocked(user)) {
  return res.status(403).json({ message: "Vault locked" });
}

  const files = await File.find({
    user: userId,
    isVaulted: true,
    isDeleted: false,
  }).sort({ vaultedAt: -1 });

  res.json(files);
};






/* Bulk Delete Fn */

const emptyTrash = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).end();

    const files = await File.find({
      user: userId,
      isDeleted: true,
    });

    for (const file of files) {
      await permanentDeleteRecursive(file._id, userId);
    }

    await AuditLog.create({
      user: userId,
      action: "empty_trash",
      meta: { count: files.length },
    });

    res.json({ message: "Trash emptied" });
  } catch (err) {
    res.status(500).json({ message: "Empty trash failed" });
  }
};



/*  desiabled now/ if needs auto unlocck on refresh in future
        case study(enable)

const getVaultStatus = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.vaultPinHash) {
    return res.json({ status: "not_set" });
  }

  if (!isVaultUnlocked(user)) {
    return res.json({ status: "locked" });
  }

  res.json({ status: "unlocked" });
}; 


*/ 

const getVaultStatus = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.vaultPinHash) {
    return res.json({ status: "not_set" });
  }

  // 🔒 ALWAYS lock on page load
  user.vaultUnlockedAt = null;
  await user.save();

  return res.json({ status: "locked" });
};










module.exports = {
  listFiles,
  uploadFile,
  downloadFile,
  previewFile,
  deleteFile,
  renameFile,
  createFolder,
  listTrash,
  deleteForever,
  restoreFromTrash,
  emptyTrash, 
  setupVaultPin,
  unlockVault,
  vaultFile,
  unvaultFile,
  listVault,
  getVaultStatus,
  shareFile,
  getSharedFile,
  getSharedFileInfo,
  previewSharedFile,
  getShareStatus,
  toggleShare,




};



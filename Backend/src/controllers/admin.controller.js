const User = require("../models/User");
const File = require("../models/File");
const AuditLog = require("../models/AuditLog");
const { GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/storage");

/* === DASHBOARD STATS === */
exports.getStats = async (req, res) => {
  const users = await User.countDocuments();
  const files = await File.countDocuments();
  const publicFiles = await File.countDocuments({ isShared: true });

  res.json({ users, files, publicFiles });
};

/* === USERS === */
exports.listUsers = async (req, res) => {
  const users = await User.find().select(
    "email usedStorage storageLimit plan isSuspended createdAt"
  );
  res.json(users);
};

exports.suspendUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).end();

 user.isSuspended = true;
user.suspendedAt = new Date();
user.suspendReason = req.body.reason || "Admin action";

// 🔥 force logout everywhere
user.tokenVersion = (user.tokenVersion || 0) + 1;

await user.save();


  await AuditLog.create({
    user: user._id,
    action: "user_suspended",
    meta: { admin: req.admin.id, reason: user.suspendReason },
  });

  res.json({ message: "User suspended" });
};

/* === FILES === */
exports.listFiles = async (req, res) => {
  const files = await File.find()
    .populate("user", "email")
    .sort({ createdAt: -1 });

  res.json(files);
};

exports.flagFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).end();

  file.isFlagged = true;
  file.flagReason = req.body.reason || "Flagged by admin";
  file.flaggedAt = new Date();
  file.flaggedBy = req.admin.id;
  await file.save();

  await AuditLog.create({
    user: file.user,
    file: file._id,
    action: "flagged",
    meta: { reason: file.flagReason, admin: req.admin.id },
  });

  res.json({ message: "File flagged" });
};

exports.deleteFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).end();

  if (!file.isFolder) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: file.key,
      })
    );
  }

  await AuditLog.create({
    user: file.user,
    file: file._id,
    action: "admin_deleted",
    meta: { admin: req.admin.id },
  });

  await File.deleteOne({ _id: file._id });

  res.json({ message: "File deleted" });
};

exports.downloadFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).end();

  const data = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: file.key,
    })
  );

  res.setHeader("Content-Type", file.type);
  res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
  data.Body.pipe(res);
};

/* === ACTIVITY LOGS === */
exports.getActivity = async (req, res) => {
  const logs = await AuditLog.find()
    .populate("user", "email")
    .populate("file", "name isVaulted isShared")
    .sort({ createdAt: -1 })
    .limit(500);

  res.json(logs);
};




exports.unsuspendUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).end();

  user.isSuspended = false;
  user.suspendedAt = null;
  user.suspendReason = null;

  // 🔓 invalidate all old tokens
  user.tokenVersion = (user.tokenVersion || 0) + 1;

  await user.save();

  await AuditLog.create({
    user: user._id,
    action: "user_unsuspended",
    meta: { admin: req.admin.id },
  });

  res.json({ message: "User unsuspended" });
};



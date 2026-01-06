/**
 * STORAGE QUOTA ENFORCEMENT
 * - Uses user.usedStorage + user.storageLimit (for progress bar)
 * - DO NOT replace with aggregation (HWC)
 * - Required for paid plans and upgraes 
 * 
 
 */



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

/* ===== LIST FILES ===== */
const listFiles = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).end();

    const parent =
      req.query.parent && req.query.parent !== "null"
        ? req.query.parent
        : null;

    const files = await File.find({
      user: userId,
      parent,
    }).sort({ isFolder: -1, createdAt: -1 });

    res.json(files);
  } catch {
    res.status(500).json({ message: "Failed to list files" });
  }
};

/* ===== PREVIEW FILE ===== */
const previewFile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).end();

    const file = await File.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!file) return res.status(404).end();

    const data = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: file.key,
      })
    );

    res.setHeader("Content-Type", file.type);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cache-Control", "private, max-age=3600");

    data.Body.pipe(res);
  } catch {
    console.warn("PREVIEW SKIPPED");
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
/* ===== DELETE FILE ===== */
const deleteFile = async (req, res) => {
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

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: file.key,
      })
    );

    const user = await User.findById(userId);
    if (user) {
      user.usedStorage = Math.max(0, user.usedStorage - file.size);
      await user.save();
    }

    await file.deleteOne();

    res.json({ message: "File deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
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

module.exports = {
  listFiles,
  uploadFile,
  downloadFile,
  previewFile,
  deleteFile,
  renameFile,
  createFolder,
};

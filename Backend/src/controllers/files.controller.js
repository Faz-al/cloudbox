const File = require("../models/File");
const User = require("../models/User");
const crypto = require("crypto");
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/storage");

/* LIST FILES */
const listFiles = async (req, res) => {
  const parent = req.query.parent || null;

  const files = await File.find({
    user: req.user.id,
    parent: parent,
  }).sort({ isFolder: -1, createdAt: -1 });

  res.json(files);
};


/* Preview Files */

const previewFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!file) return res.status(404).end();

    const data = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: file.key,
      })
    );

    res.setHeader("Content-Type", file.type);
    res.setHeader("Content-Disposition", "inline"); // ✅ REQUIRED
    res.setHeader("Cache-Control", "private, max-age=3600");

    data.Body.pipe(res);
  } catch (err) {
    // ⚠️ Do NOT console.error here (prevents spam)
    console.warn("PREVIEW SKIPPED");
    res.status(404).end();
  }
};




/* UPLOAD FILE */
const uploadFile = async (req, res) => {
  try {
    const userId = req.user.id;

    const used = await File.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: "$size" } } },
    ]);

    const usedBytes = used[0]?.total || 0;
    const user = await User.findById(userId);

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (usedBytes + req.file.size > user.quota)
      return res.status(403).json({ message: "Storage quota exceeded" });

    const key = crypto.randomBytes(16).toString("hex");

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const file = await File.create({
      user: userId,
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      parent: req.body.parent || null,
      isFolder: false,

      key,
    });

    res.status(201).json(file);
  } catch {
    res.status(500).json({ message: "Upload failed" });
  }
};

/* DOWNLOAD FILE */
const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user.id,
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




/* DELETE FILE */
const deleteFile = async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, user: req.user.id });
  if (!file) return res.status(404).json({ message: "File not found" });

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: file.key,
    })
  );

  await file.deleteOne();
  res.json({ message: "File deleted" });
};


/* RENAME FILE */
const renameFile = async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Invalid filename" });
  }

  const file = await File.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  file.name = name.trim();
  await file.save();

  res.json(file);
};


/* CREATE FOLDER */
const createFolder = async (req, res) => {
  const { name, parent = null } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Folder name required" });
  }

  const folder = await File.create({
    user: req.user.id,
    name,
    size: 0,
    type: "folder",
    key: `folder-${Date.now()}`,
    parent,
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


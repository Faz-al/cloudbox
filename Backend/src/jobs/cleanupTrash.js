const File = require("../models/File");
const AuditLog = require("../models/AuditLog");
const { permanentDeleteRecursive } = require("../controllers/files.controller");

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

const cleanupTrash = async () => {
  const cutoff = new Date(Date.now() - THIRTY_DAYS);

  const files = await File.find({
    isDeleted: true,
    deletedAt: { $lte: cutoff },
  });

  for (const file of files) {
    await permanentDeleteRecursive(file._id, file.user);
    await AuditLog.create({
      user: file.user,
      file: file._id,
      action: "auto_delete",
    });
  }
};

module.exports = cleanupTrash;

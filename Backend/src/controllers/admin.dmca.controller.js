const DMCA = require("../models/DMCA");
const File = require("../models/File");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

exports.getDmcaReports = async (req, res) => {
  const reports = await DMCA.find()
    .populate("relatedFile")
    .populate("relatedUser")
    .sort({ createdAt: -1 });

  res.json(reports);
};

exports.deleteFileFromDmca = async (req, res) => {
  const dmca = await DMCA.findById(req.params.id).populate("relatedFile");

  if (!dmca || !dmca.relatedFile) {
    return res.status(404).json({ message: "File not found" });
  }

  await File.findByIdAndDelete(dmca.relatedFile._id);

  dmca.status = "resolved";
  await dmca.save();

  await AuditLog.create({
    user: dmca.relatedUser,
    action: "DMCA_FILE_DELETED",
    target: dmca.relatedFile._id
  });

  res.json({ success: true });
};

exports.suspendUserFromDmca = async (req, res) => {
  const dmca = await DMCA.findById(req.params.id).populate("relatedUser");

  if (!dmca || !dmca.relatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  dmca.relatedUser.isSuspended = true;
  await dmca.relatedUser.save();

  dmca.status = "resolved";
  await dmca.save();

  await AuditLog.create({
    user: dmca.relatedUser._id,
    action: "DMCA_USER_SUSPENDED",
    target: dmca.relatedUser._id
  });

  res.json({ success: true });
};

exports.resolveDmca = async (req, res) => {
  const { status } = req.body;

  const dmca = await DMCA.findById(req.params.id);
  dmca.status = status;
  await dmca.save();

  await AuditLog.create({
    user: dmca.relatedUser,
    action: "DMCA_MARKED_" + status.toUpperCase(),
    target: dmca._id
  });

  res.json({ success: true });
};

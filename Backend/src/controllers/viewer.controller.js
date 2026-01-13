// src/controllers/viewer.controller.js

const crypto = require("crypto");
const ViewerAccess = require("../models/ViewerAccess");

const getViewerHash = (req) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "";
  const ua = req.headers["user-agent"] || "";
  return crypto.createHash("sha256").update(ip + ua).digest("hex");
};

exports.checkAccess = async (req, res) => {
  try {
    const { token } = req.params;
    const viewerHash = getViewerHash(req);

    const access = await ViewerAccess.findOne({
      shareToken: token,
      viewerHash,
      expiresAt: { $gt: new Date() },
    });

    if (!access) {
      return res.json({ allowed: false });
    }

    return res.json({
      allowed: true,
      tier: access.tier,
      expiresAt: access.expiresAt,
    });
  } catch (err) {
    console.error("Viewer access check error:", err);
    return res.status(500).json({ message: "Viewer access check failed" });
  }
};

exports.grantAccess = async (req, res) => {
  try {
    const { token, tier } = req.body;
    const viewerHash = getViewerHash(req);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await ViewerAccess.findOneAndUpdate(
      { shareToken: token, viewerHash },
      { tier, expiresAt },
      { upsert: true, new: true }
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("Grant viewer access error:", err);
    return res.status(500).json({ message: "Failed to grant viewer access" });
  }
};

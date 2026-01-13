const mongoose = require("mongoose");

const securitySessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  fingerprint: String,   // browser+os hash
  ip: String,
  userAgent: String,
  browser: String,
  os: String,
  device: String,

  firstSeen: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },

  isCurrent: { type: Boolean, default: false },
  isSuspicious: { type: Boolean, default: false }
});

module.exports = mongoose.model("SecuritySession", securitySessionSchema);

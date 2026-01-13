const mongoose = require("mongoose");

const dmcaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: String,
  email: { type: String, required: true },

  copyrightedWork: { type: String, required: true },
  infringingUrl: { type: String, required: true },

  goodFaith: { type: Boolean, required: true },
  accuracy: { type: Boolean, required: true },
  signature: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "resolved", "rejected"],
    default: "pending"
  },

  relatedFile: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }

}, { timestamps: true });

module.exports = mongoose.model("DMCA", dmcaSchema);

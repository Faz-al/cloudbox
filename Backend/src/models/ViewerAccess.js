// src/models/ViewerAccess.js

const mongoose = require("mongoose");

const viewerAccessSchema = new mongoose.Schema(
  {
    shareToken: {
      type: String,
      required: true,
      index: true,
    },
    viewerHash: {
      type: String,
      required: true,
      index: true,
    },
    tier: {
      type: String,
      enum: ["ads_free", "ads_free_fast"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

viewerAccessSchema.index(
  { shareToken: 1, viewerHash: 1 },
  { unique: true }
);

module.exports = mongoose.model("ViewerAccess", viewerAccessSchema);

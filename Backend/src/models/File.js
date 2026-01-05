const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: { type: String, required: true },

    size: { type: Number, required: true },

    type: { type: String, required: true },

    key: { type: String, required: true, unique: true },

    // 🔽 NEW
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },

    isFolder: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);

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

      originalParent: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "File",
  default: null,
},

    

    isFolder: {
      type: Boolean,
      default: false,
    },

        // 🔽 TRASH (Recently Deleted)
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isVaulted: {
  type: Boolean,
  default: false,
  index: true,
},

vaultedAt: {
  type: Date,
  default: null,
},

vaultParent: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "File",
  default: null,
},



  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);


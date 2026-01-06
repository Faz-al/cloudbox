const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Storage
    storageLimit: {
      type: Number,
      default: 5 * 1024 * 1024 * 1024,
    },
    usedStorage: {
      type: Number,
      default: 0,
    },
    plan: {
      type: String,
      default: "free",
    },

    // 🔐 PASSWORD RESET 
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },



    termsAcceptedAt: {
  type: Date,
  default: null,
},

termsVersion: {
  type: String,
  default: "2026-01",
},



// 📧 EMAIL VERIFICATION
isEmailVerified: {
  type: Boolean,
  default: false,
},
emailVerifyToken: String,
emailVerifyExpires: Date,









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


    vaultPinHash: {
  type: String,
  default: null,
},

vaultUnlockedAt: {
  type: Date,
  default: null,
},

tokenVersion: {
  type: Number,
  default: 0,
},


isSuspended: {
  type: Boolean,
  default: false,
},
suspendedAt: Date,
suspendReason: String,


  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

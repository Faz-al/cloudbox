const mongoose = require("mongoose");

const signupOTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL
    },
  },
  {
    timestamps: true, // ✅ MUST be here
  }
);

module.exports = mongoose.model("SignupOTP", signupOTPSchema);

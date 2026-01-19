const mongoose = require("mongoose");

const loginOTPSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

loginOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
loginOTPSchema.index({ userId: 1 });


module.exports = mongoose.model("LoginOTP", loginOTPSchema);

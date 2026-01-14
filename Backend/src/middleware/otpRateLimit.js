const SignupOTP = require("../models/SignupOTP");

const otpRateLimit = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const windowStart = new Date(Date.now() - 10 * 60 * 1000);

  const attempts = await SignupOTP.countDocuments({
    email,
    createdAt: { $gte: windowStart },
  });

  if (attempts >= 5) {
    return res.status(429).json({
      message: "Too many OTP requests. Please wait before trying again.",
    });
  }

  next();
};

module.exports = otpRateLimit;

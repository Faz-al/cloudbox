console.log("🔥 AUTH ROUTES FILE LOADED");

const securityTracker = require("../middleware/securityTracker");



const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth.middleware");
const otpRateLimit = require("../middleware/otpRateLimit");
const forgotPasswordRateLimit = require("../middleware/forgotPasswordRateLimit");




const {
  signup,
  signupStart,
  signupVerify,
  login,
  verifyLoginOTP,
  resendLoginOTP,
  toggleEmail2FA,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
  logoutAll
} = require("../controllers/auth.controller");





  const SecuritySession = require("../models/SecuritySession");

router.get("/security/sessions", authMiddleware, async (req, res) => {
  const sessions = await SecuritySession.find({ userId: req.user.id }).sort({
    lastSeen: -1
  });

  res.json(sessions);
});

router.post("/security/sessions/:id/logout", authMiddleware, async (req, res) => {
  await SecuritySession.deleteOne({
    _id: req.params.id,
    userId: req.user.id
  });

  res.json({ message: "Device removed" });
});


router.post("/signup", signup);
router.post("/login", login);
router.post("/login/2fa", verifyLoginOTP);
router.post("/login/2fa/resend", resendLoginOTP);


router.post("/logout", logout);
router.post("/logout-all", authMiddleware, logoutAll);
router.post("/security/2fa-toggle", authMiddleware, toggleEmail2FA);
router.post("/signup/verify", signupVerify);
router.post("/signup/start", otpRateLimit, signupStart);
router.post("/change-password", authMiddleware, changePassword);




router.post("/forgot-password", forgotPasswordRateLimit, forgotPassword);
router.post("/reset-password/:token", resetPassword);


// /me route
router.get("/me", authMiddleware, securityTracker, async (req, res) => {

  const user = await User.findById(req.user.id).select(
  "_id email storageLimit usedStorage plan email2FAEnabled"
);


  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

router.post("/security/logout-others", authMiddleware, async (req, res) => {
  await SecuritySession.deleteMany({
    userId: req.user.id,
    isCurrent: false
  });

  res.json({ message: "All other devices logged out" });
});




module.exports = router;

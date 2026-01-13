console.log("🔥 AUTH ROUTES FILE LOADED");
const { logoutAll } = require("../controllers/auth.controller");

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth.middleware");

const { signup, login, logout, forgotPassword, resetPassword, changePassword,} =
  require("../controllers/auth.controller");


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
router.post("/logout", logout);
router.post("/logout-all", authMiddleware, logoutAll);
router.post("/change-password", authMiddleware, changePassword);


router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


// /me route
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "_id email storageLimit usedStorage plan"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Auth check (VERY IMPORTANT)
router.get("/me", authMiddleware, (req, res) => {
  res.json({ userId: req.user.id });
});

// TEMP test route (can remove later)


module.exports = router;

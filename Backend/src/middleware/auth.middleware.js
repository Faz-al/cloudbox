/**
 * AUTH MIDDLEWARE (DO NOT MODIFY CASUALLY)
 * - Cookie-based JWT auth
 * - Enforces tokenVersion for logout-everywhere
 * - Used by /auth/me and all protected routes
 * - remember fazal (very imp)
 */  



const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔐 tokenVersion enforcement (logout everywhere)
    if ((decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({ message: "Session expired" });
    }

    req.user = { id: user._id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;

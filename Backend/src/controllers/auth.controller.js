const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");


/* ===== COOKIE OPTIONS (PRODUCTION SAFE) ===== */
const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,                 // 🔥 only true in production
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};


/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
  email,
  password: hashedPassword,
  storageLimit: 5 * 1024 * 1024 * 1024, // 5 GB
  usedStorage: 0,
  plan: "free",
});


    const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    tokenVersion: user.tokenVersion || 0,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


    


    return res.status(201).json({
    message: "Signup successful",
    user: {
    email: user.email,
    storageLimit: user.storageLimit,
    usedStorage: user.usedStorage,
    plan: user.plan,
  },
});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    tokenVersion: user.tokenVersion || 0,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


    res.cookie("token", token, cookieOptions);

    return res.json({
      message: "Login successful",
      user: {
      email: user.email,
      storageLimit: user.storageLimit,
      usedStorage: user.usedStorage,
    },

    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        message: "If an account exists, a reset link has been sent",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If an account exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    console.log("DEBUG saved token hash:", user.resetPasswordToken);
    console.log("DEBUG expires at:", user.resetPasswordExpires);


    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    console.log("🔐 PASSWORD RESET LINK:", resetUrl);

    res.json({
      message: "If an account exists, a reset link has been sent",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= RESET PASSWORD ================= */
/* ================= RESET PASSWORD ================= */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({ resetPasswordToken: hashedToken });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 🔒 Expiry check in JS (not Mongo)
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1;


    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



/* ================= CHANGE PASSWORD (LOGGED IN) ================= */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    // 🔐 logout everywhere
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};





/* ================= LOGOUT ================= */
/* ================= LOGOUT ================= */
const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
};




     // logout all

const logoutAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({ message: "Logged out from all devices" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};



module.exports = {
  signup,
  login,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  changePassword, // ✅ ADD THIS
};


const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ===========================
   BOOTSTRAP (ONE TIME ONLY)
=========================== */
const bootstrapAdmin = async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      return res.status(403).json({ message: "Bootstrap disabled" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const hash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      email,
      password: hash,
    });

    res.json({ message: "Admin created", adminId: admin._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ADMIN LOGIN
=========================== */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "12h" }
    );

    admin.lastLogin = new Date();
    await admin.save();

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Admin logged in" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ADMIN LOGOUT
=========================== */
const logoutAdmin = async (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Logged out" });
};

/* ===========================
   ADMIN SESSION
=========================== */
const me = async (req, res) => {
  res.json({ admin: req.admin });
};

module.exports = {
  bootstrapAdmin,
  loginAdmin,
  logoutAdmin,
  me,
};

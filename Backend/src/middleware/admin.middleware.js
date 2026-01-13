const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) return res.status(401).json({ message: "Admin unauthorized" });

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: "Admin unauthorized" });

    req.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Admin unauthorized" });
  }
};

module.exports = adminAuth;

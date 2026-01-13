const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.auth.controller");
const adminAuth = require("../middleware/admin.middleware");

/* ONE TIME SETUP */
router.post("/bootstrap", adminController.bootstrapAdmin);

/* AUTH */
router.post("/login", adminController.loginAdmin);
router.post("/logout", adminAuth, adminController.logoutAdmin);
router.get("/me", adminAuth, adminController.me);

module.exports = router;

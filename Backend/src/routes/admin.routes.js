const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/admin.middleware");
const admin = require("../controllers/admin.controller");

router.get("/stats", adminAuth, admin.getStats);

router.get("/users", adminAuth, admin.listUsers);
router.post("/users/:id/suspend", adminAuth, admin.suspendUser);

router.get("/files", adminAuth, admin.listFiles);
router.post("/files/:id/flag", adminAuth, admin.flagFile);
router.delete("/files/:id", adminAuth, admin.deleteFile);
router.get("/files/:id/download", adminAuth, admin.downloadFile);
router.get("/activity", adminAuth, admin.getActivity);
router.post("/users/:id/unsuspend", adminAuth, admin.unsuspendUser);



module.exports = router;

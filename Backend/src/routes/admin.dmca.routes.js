const express = require("express");
const adminAuth = require("../middleware/admin.middleware");

const {
  getDmcaReports,
  deleteFileFromDmca,
  suspendUserFromDmca,
  resolveDmca
} = require("../controllers/admin.dmca.controller");

const router = express.Router();

router.get("/", adminAuth, getDmcaReports);
router.post("/:id/delete-file", adminAuth, deleteFileFromDmca);
router.post("/:id/suspend-user", adminAuth, suspendUserFromDmca);
router.post("/:id/resolve", adminAuth, resolveDmca);

module.exports = router;

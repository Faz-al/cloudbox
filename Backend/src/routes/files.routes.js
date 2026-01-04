const express = require("express");
const router = express.Router();

// const authMiddleware = require("../middleware/auth.middleware");
const {
  listFiles,
  getUploadUrl,
  deleteFile,
} = require("../controllers/files.controller");

// router.use(authMiddleware);

router.get("/", listFiles);
router.post("/upload-url", getUploadUrl);
router.delete("/:id", deleteFile);

module.exports = router;

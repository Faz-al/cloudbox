const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/auth.middleware");
const upload = multer({ storage: multer.memoryStorage() });

const {
  listFiles,
  uploadFile,
  downloadFile,
  previewFile,
  deleteFile,
  renameFile,
  createFolder, // ✅ IMPORT MISSING
} = require("../controllers/files.controller");

/* AUTH */
router.use(authMiddleware);

/* LIST FILES (supports ?parent=) */
router.get("/", listFiles);

/* UPLOAD FILE */
router.post("/upload", upload.single("file"), uploadFile);

/* CREATE FOLDER — MUST BE BEFORE :id ROUTES */
router.post("/folder", createFolder);

/* RENAME FILE / FOLDER */
router.patch("/:id/rename", renameFile);

/* PREVIEW */
router.get("/:id/preview", previewFile);

/* DOWNLOAD */
router.get("/download/:id", downloadFile);

/* DELETE */
router.delete("/:id", deleteFile);

module.exports = router;

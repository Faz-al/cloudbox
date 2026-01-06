const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/auth.middleware");


const os = require("os");
const path = require("path");



const upload = multer({
  storage: multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024, // 10 GB
  },
});



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

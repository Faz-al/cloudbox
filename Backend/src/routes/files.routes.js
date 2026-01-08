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
  createFolder,
  listTrash,
  deleteForever,
  restoreFromTrash,
  emptyTrash,
  setupVaultPin,
  unlockVault,
  vaultFile,
  unvaultFile,
  listVault,
  getVaultStatus,

} = require("../controllers/files.controller");

//* AUTH */
router.use(authMiddleware);

/* ===== TRASH ROUTES (MUST BE FIRST) ===== */
router.get("/trash", listTrash);
router.post("/trash/:id/restore", restoreFromTrash);
router.delete("/trash/:id/permanent", deleteForever);
router.delete("/trash", emptyTrash);
router.get("/vault/status", getVaultStatus);



/* ===== FILE LIST ===== */
router.get("/", listFiles);

/* ===== CREATE ===== */
router.post("/upload", upload.single("file"), uploadFile);
router.post("/folder", createFolder);

/* ===== FILE ACTIONS ===== */
router.patch("/:id/rename", renameFile);
router.get("/:id/preview", previewFile);
router.get("/download/:id", downloadFile);
router.delete("/:id", deleteFile);


/* Valut actions */

router.get("/vault/status", getVaultStatus);
router.get("/vault", listVault);
router.post("/vault/setup", setupVaultPin);
router.post("/vault/unlock", unlockVault);
router.post("/vault/:id", vaultFile);
router.delete("/vault/:id", unvaultFile);










module.exports = router;

// src/routes/viewer.routes.js

const express = require("express");
const router = express.Router();
const {
  checkAccess,
  grantAccess,
} = require("../controllers/viewer.controller");

router.get("/access/:token", checkAccess);
router.post("/grant", grantAccess);

module.exports = router;

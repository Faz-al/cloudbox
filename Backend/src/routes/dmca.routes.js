const express = require("express");
const { submitDmca } = require("../controllers/dmca.controller");

const router = express.Router();

router.post("/submit", submitDmca);

module.exports = router;

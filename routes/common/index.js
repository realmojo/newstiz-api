const express = require("express");
const router = express.Router();
const commonController = require("./common");

router.get("/", commonController.getPing);
module.exports = router;

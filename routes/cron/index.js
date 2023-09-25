const express = require("express");
const router = express.Router();
const cronController = require("./cron");

router.get("/", cronController.doCron);
module.exports = router;

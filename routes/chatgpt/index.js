const express = require("express");
const router = express.Router();
const gptController = require("./gpt");
const naverController = require("./naver");

router.get("/naver/link", naverController.getNaverTopNewsLink);
router.get("/content", gptController.getNewsContent);
router.get("/keyword", gptController.getKeyword);
module.exports = router;

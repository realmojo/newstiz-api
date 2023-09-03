const express = require("express");
const router = express.Router();
const gptController = require("./gpt");
const naverController = require("./naver");

/**
 * 그 외 필요한 API
 *
 */

router.get("/naver/link", naverController.getNaverTopNewsLink);
router.get("/naver/content", naverController.getNaverNewsContent);
router.get("/keyword", gptController.getKeyword);
module.exports = router;

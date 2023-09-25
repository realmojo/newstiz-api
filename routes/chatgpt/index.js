const express = require("express");
const router = express.Router();
const gptController = require("./gpt");
const naverController = require("./naver");

router.get("/naver/link", naverController.getNaverTopNewsLink);
router.get("/social", naverController.getSocialCrawl);
router.get("/asia", naverController.getAsiaWorldCrawl);
router.get("/america", naverController.getAmericaWorldCrawl);
router.get("/finance", naverController.getEconomyFinanceCrawl);
router.get("/life_health", naverController.getLifeHealthCrawl);
router.get("/economy_life", naverController.getEconomyLifeCrawl);
// router.get("/life_normal", naverController.getLifeNormalCrawl);
router.get("/economy_investing", naverController.getInvestingNewsCrawl);
router.get("/economy_crypto", naverController.getCryptoNewsCrawl);
router.get("/content", gptController.getNewsContent);
router.get("/keyword", gptController.getKeyword);
module.exports = router;

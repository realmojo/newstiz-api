const express = require("express");
const router = express.Router();
const gptController = require("./gpt");
const crawlController = require("./crawl");

router.get("/naver/link", crawlController.getNaverTopNewsLink);
router.get("/social", crawlController.getSocialCrawl);
router.get("/asia", crawlController.getAsiaWorldCrawl);
router.get("/america", crawlController.getAmericaWorldCrawl);
router.get("/finance", crawlController.getEconomyFinanceCrawl);
router.get("/life_health", crawlController.getLifeHealthCrawl);
router.get("/economy_life", crawlController.getEconomyLifeCrawl);
router.get("/economy_investing", crawlController.getInvestingNewsCrawl);
router.get("/economy_crypto", crawlController.getCryptoNewsCrawl);
router.get("/entertain", crawlController.getEntertainCrawl);
router.get("/content", gptController.getNewsContent);
router.get("/keyword", gptController.getKeyword);
module.exports = router;

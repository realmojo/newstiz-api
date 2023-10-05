const cron = require("node-cron");
const {
  doSocialCrawl,
  doAmericaWorldCrawl,
  doEconomyFinanceCrawl,
  doInvestingNewsCrawl,
  doCryptoNewsCrawl,
  doLifeHealthCrawl,
  doEntertainCrawl,
} = require("../chatgpt/doCrawl");

cron.schedule("0 4 * * *", async () => {
  console.log("do Socail start");
  await doSocialCrawl();
  await doEntertainCrawl();

  console.log("crawling Socail end");
});
cron.schedule("30 4 * * *", async () => {
  console.log("do American start");
  await doAmericaWorldCrawl();

  console.log("crawling American end");
});

cron.schedule("0 5 * * *", async () => {
  console.log("do Economy start");
  await doEconomyFinanceCrawl();

  console.log("crawling Economy end");
});

cron.schedule("30 5 * * *", async () => {
  console.log("do Investing start");
  await doInvestingNewsCrawl();

  console.log("crawling Investing end");
});

cron.schedule("0 6 * * *", async () => {
  console.log("do Crypto start");
  await doCryptoNewsCrawl();
  await doLifeHealthCrawl();
  await doEntertainCrawl();

  console.log("crawling Crypto end");
});

cron.schedule("0 7 * * *", async () => {
  console.log("do Life start");
  await doLifeHealthCrawl();
  await doEntertainCrawl();

  console.log("crawling Life end");
});

cron.schedule("0 8 * * *", async () => {
  console.log("do Entertain start");
  await doEntertainCrawl();

  console.log("crawling Entertain end");
});

const doCron = async (req, res) => {
  try {
    return res.status(200).send({ status: "ok" });
  } catch (e) {
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  doCron,
};

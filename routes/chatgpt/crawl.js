const axios = require("axios");
const cheerio = require("cheerio");
const {
  doSocialCrawl,
  doEconomyFinanceCrawl,
  doLifeHealthCrawl,
  doInvestingNewsCrawl,
  doEconomyLifeCrawl,
  doCryptoNewsCrawl,
  doAsiaWorldCrawl,
  doAmericaWorldCrawl,
} = require("./doCrawl");

const getNaverTopNewsLink = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      throw new Error("keyword parameter");
    }

    const url = `https://m.search.naver.com/search.naver?where=m_news&sm=mtb_jum&query=${encodeURI(
      keyword
    )}`;
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const items = $(".news_wrap");

    const links = [];
    for (let item of items) {
      const link = item.children[2].attribs.href;
      links.push(link);
    }

    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getSocialCrawl = async (req, res) => {
  try {
    const links = await doSocialCrawl();
    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getAsiaWorldCrawl = async (req, res) => {
  try {
    const links = await doAsiaWorldCrawl();
    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getAmericaWorldCrawl = async (req, res) => {
  try {
    const links = await doAmericaWorldCrawl();
    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getEconomyFinanceCrawl = async (req, res) => {
  try {
    const links = await doEconomyFinanceCrawl();
    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getEconomyLifeCrawl = async (req, res) => {
  try {
    const links = await doEconomyLifeCrawl();
    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getInvestingNewsCrawl = async (req, res) => {
  try {
    const links = await doInvestingNewsCrawl();
    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getCryptoNewsCrawl = async (req, res) => {
  try {
    const links = await doCryptoNewsCrawl();
    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getLifeHealthCrawl = async (req, res) => {
  try {
    const links = await doLifeHealthCrawl();
    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  getNaverTopNewsLink,
  getSocialCrawl,
  getAsiaWorldCrawl,
  getAmericaWorldCrawl,
  getEconomyFinanceCrawl,
  getEconomyLifeCrawl,
  getInvestingNewsCrawl,
  getCryptoNewsCrawl,
  getLifeHealthCrawl,
};

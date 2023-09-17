const axios = require("axios");
const cheerio = require("cheerio");

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
    const url =
      "https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=102&sid2=249";
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const items = $(".type06_headline > li > dl > .photo > a");

    const links = [];
    for (let item of items) {
      const link = item.attribs.href;
      if (links.indexOf(link) === -1) {
        links.push(link);
      }
    }

    for (const link of links) {
      // console.log(link);
      await axios(
        `http://localhost:3001/api/chatgpt/content?category=social&url=${link}`
      );
    }

    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getAsiaWorldCrawl = async (req, res) => {
  try {
    const url =
      "https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=104&sid2=231";
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const items = $(".type06_headline > li > dl > .photo > a");

    const links = [];
    for (let item of items) {
      const link = item.attribs.href;
      if (links.indexOf(link) === -1) {
        links.push(link);
      }
    }

    for (const link of links) {
      await axios(
        `http://localhost:3001/api/chatgpt/content?category=world&url=${link}`
      );
    }

    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getAmericaWorldCrawl = async (req, res) => {
  try {
    const url =
      "https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=104&sid2=232";
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const items = $(".type06_headline > li > dl > .photo > a");

    const links = [];
    for (let item of items) {
      const link = item.attribs.href;
      if (links.indexOf(link) === -1) {
        links.push(link);
      }
    }

    for (const link of links) {
      await axios(
        `http://localhost:3001/api/chatgpt/content?category=world&url=${link}`
      );
    }

    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getEconomyFinanceCrawl = async (req, res) => {
  try {
    const url =
      "https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=101&sid2=259";
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const items = $(".type06_headline > li > dl > .photo > a");

    const links = [];
    for (let item of items) {
      const link = item.attribs.href;
      if (links.indexOf(link) === -1) {
        links.push(link);
      }
    }

    for (const link of links) {
      console.log(link);
      // await axios(
      //   `http://localhost:3001/api/chatgpt/content?category=economy&url=${link}`
      // );
    }

    return res.status(200).send({ status: "ok", links });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getEconomyLifeCrawl = async (req, res) => {
  try {
    const url =
      "https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=101&sid2=310";
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const items = $(".type06_headline > li > dl > .photo > a");

    const links = [];
    for (let item of items) {
      const link = item.attribs.href;
      if (links.indexOf(link) === -1) {
        links.push(link);
      }
    }

    for (const link of links) {
      await axios(
        `http://localhost:3001/api/chatgpt/content?category=economy&url=${link}`
      );
    }

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
};

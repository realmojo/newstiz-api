const axios = require("axios");
const cheerio = require("cheerio");

const getNaverTopNewsLink = async (req, res, next) => {
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
    return next({
      status: "error",
      message: e.message,
    });
  }
};

module.exports = {
  getNaverTopNewsLink,
};

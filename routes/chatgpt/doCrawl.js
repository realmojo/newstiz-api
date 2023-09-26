const axios = require("axios");
const cheerio = require("cheerio");
const { doNewsContent } = require("./gpt");

const doSocialCrawl = async () => {
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
    await doNewsContent("social", link);
    // await axios(`${BASE_URL}/api/chatgpt/content?category=social&url=${link}`);
  }
  return links;
};

const doAsiaWorldCrawl = async () => {
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
    await doNewsContent("world", link);
    // await axios(`${BASE_URL}/api/chatgpt/content?category=world&url=${link}`);
  }
  return links;
};

const doAmericaWorldCrawl = async () => {
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
    await doNewsContent("world", link);
    // await axios(`${BASE_URL}/api/chatgpt/content?category=world&url=${link}`);
  }
  return links;
};

const doEconomyFinanceCrawl = async () => {
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
    await doNewsContent("economy", link);
    // await axios(`${BASE_URL}/api/chatgpt/content?category=economy&url=${link}`);
  }
  return links;
};

const doEconomyLifeCrawl = async () => {
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
    await doNewsContent("economy", link);
    // await axios(`${BASE_URL}/api/chatgpt/content?category=economy&url=${link}`);
  }
  return links;
};

const doInvestingNewsCrawl = async () => {
  const url = "https://kr.investing.com/news/most-popular-news";
  const response = await axios(url);
  const $ = cheerio.load(response.data);
  const items = $(".largeTitle > article > a");

  const links = [];
  for (let item of items) {
    const link = item.attribs.href;
    if (links.indexOf(link) === -1 && link.indexOf("news") !== -1) {
      links.push(`https://kr.investing.com/${link}`);
    }
  }

  for (const link of links) {
    await doNewsContent("economy", link);
    // await axios(`${BASE_URL}/api/chatgpt/content?category=economy&url=${link}`);
  }
  return links;
};

const doCryptoNewsCrawl = async () => {
  const url = "https://kr.investing.com/news/cryptocurrency-news";
  const response = await axios(url);
  const $ = cheerio.load(response.data);
  const items = $(".largeTitle > article > a");

  const links = [];
  for (let item of items) {
    const link = item.attribs.href;
    if (links.indexOf(link) === -1 && link.indexOf("news") !== -1) {
      links.push(`https://kr.investing.com/${link}`);
    }
  }

  for (const link of links) {
    await doNewsContent("crypto", link);
    // await axios(`${BASE_URL}/api/chatgpt/content?category=crypto&url=${link}`);
  }
  return links;
};

const doLifeHealthCrawl = async () => {
  const url =
    "https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=103&sid2=241";
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
    await doNewsContent("life", link);
    // await axios(`${BASE_URL}/api/chatgpt/content?category=life&url=${link}`);
  }

  return links;
};

module.exports = {
  doSocialCrawl,
  doAsiaWorldCrawl,
  doAmericaWorldCrawl,
  doEconomyFinanceCrawl,
  doEconomyLifeCrawl,
  doInvestingNewsCrawl,
  doCryptoNewsCrawl,
  doLifeHealthCrawl,
};

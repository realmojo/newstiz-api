const axios = require("axios");
const cheerio = require("cheerio");
const sharp = require("sharp");

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

const getNaverNewsContent = async (req, res, next) => {
  try {
    const { url } = req.query;
    if (!url) {
      throw new Error("url parameter");
    }

    const response = await axios(url);
    const $ = cheerio.load(response.data);

    const contentArea = $("#dic_area");
    const title = $("title").text();
    const imageUrl = $("#img1")[0].attribs["data-src"];
    const strongText = $("#dic_area > strong").text();
    // const strongText = $("#dic_area > strong").text();

    contentArea.find(".end_photo_org").remove();
    contentArea.find("strong").remove();
    const content = contentArea.html();
    // const description = $("meta").attr("description").text();

    // 이미지 다운로드 후 리사이징 아래 로고를 자른다.
    const input = (await axios({ url: imageUrl, responseType: "arraybuffer" }))
      .data;

    const imageInfo = await sharp(input);
    const imageMetadata = await imageInfo.metadata();
    const imageResizeWidth = imageMetadata.width;
    const imageResizeHeight = imageMetadata.height - 60;
    // console.log(imageMetadata.width, imageMetadata.height);

    // const output = await sharp(input).png().toBuffer();
    const output = await sharp(input)
      .resize({
        width: imageResizeWidth,
        height: imageResizeHeight,
        position: "left top",
      })
      .toFile("output_image.png");

    console.log(input);
    // console.log(output);

    console.log(imageUrl);
    console.log(title);
    console.log(strongText);
    // console.log(description);
    // const items = $(".news_wrap");
    // const items = $(".news_wrap");

    // const links = [];
    // for (let item of items) {
    //   const link = item.children[2].attribs.href;
    //   links.push(link);
    // }

    return res
      .status(200)
      .send({ status: "ok", items: { title, imageUrl, strongText, content } });
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
  getNaverNewsContent,
};

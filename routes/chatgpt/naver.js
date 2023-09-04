const fs = require("fs");
const AWS = require("aws-sdk");
const axios = require("axios");
const cheerio = require("cheerio");
const sharp = require("sharp");
const env = require("dotenv").config().parsed;
const moment = require("moment");

const getRewritePost = async (obj) => {
  console.log(obj.content);
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          // messages: [
          //   {
          //     role: "user",
          //     content: `${obj.content} 위의 내용을 재작성 해줘`,
          //     // content: `hello~`,
          //   },
          // ],
          messages: [
            {
              role: "user",
              content: `hello~`,
            },
            {
              role: "user",
              content: `what is your name?`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const { data } = res;
        console.log(data);
        if (data) {
          resolve(data.choices[0].message);
        }
      });
  });
};

const imageS3Upload = async (imageUrl) => {
  const s3 = new AWS.S3({
    accessKeyId: env.NEWSTIZ_ACCESS_KEY_ID,
    secretAccessKey: env.NEWSTIZ_ASECRET_KEY_ID,
  });
  const imageFilename = "output_image.png";

  // 이미지 다운로드 후 리사이징 아래 로고를 자른다.
  const input = (await axios({ url: imageUrl, responseType: "arraybuffer" }))
    .data;

  const imageInfo = await sharp(input);
  const imageMetadata = await imageInfo.metadata();
  const imageResizeWidth = imageMetadata.width;
  const imageResizeHeight = imageMetadata.height - 60;

  await sharp(input)
    .resize({
      width: imageResizeWidth,
      height: imageResizeHeight,
      position: "left top",
    })
    .toFile(imageFilename);

  const imagePath = `${__dirname}/../..`;
  const imageData = fs.readFileSync(`${imagePath}/${imageFilename}`);
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: env.BUCKET_NAME,
        Key: `${moment().format("YYYY")}/${moment().format(
          "MM-DD"
        )}/img_${new Date().getTime()}_${imageFilename}`,
        Body: imageData,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          reject("");
        } else {
          resolve(data.Location);
          console.log(`File uploaded successfully. ${data.Location}`);
        }
      }
    );
  });
};

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

    // const s3ImageUrl = await imageS3Upload(imageUrl);
    const s3ImageUrl = "";

    console.log(s3ImageUrl);

    const items = {
      title,
      s3ImageUrl,
      strongText,
      content,
    };
    const reWriteItems = await getRewritePost(items);

    console.log(reWriteItems);

    return res.status(200).send({ status: "ok", items });
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

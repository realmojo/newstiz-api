const Post = require("../../schemas/Posts");
const fs = require("fs");
const AWS = require("aws-sdk");
const sharp = require("sharp");
const env = require("dotenv").config().parsed;
const moment = require("moment");
const axios = require("axios");
const cheerio = require("cheerio");
const { getNextSequence, getRandomUser, shuffle } = require("./common");

const getKeyword = async (req, res, next) => {
  try {
    return res.status(200).send({ status: "ok" });
  } catch (e) {
    return next({
      status: "error",
      message: e.message,
    });
  }
};

// const split = data.split("\n");
// console.log(split);
const getRewritePost = async (obj) => {
  console.log(obj);
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `${obj.content} 위의 내용을 재작성 해줘`,
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
          const content = data.choices[0].message.content;
          console.log(content);
          const splitData = content.split(". ");
          const pHtml = splitData.map((item) => {
            item = item.replace("<br>", "");
            item = item.charAt(item.length - 1) === "." ? item : `${item}.`;
            return `${item}`;
          });
          console.log(pHtml);

          resolve(pHtml);
          // resolve();
        }
      });
  });
};

const imageS3Upload = async (imageUrl) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.NEWSTIZ_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEWSTIZ_SECRET_KEY_ID,
  });
  const imageFilename = "output_image.png";

  // 이미지 다운로드 후 리사이징 아래 로고를 자른다.
  const input = (await axios({ url: imageUrl, responseType: "arraybuffer" }))
    .data;

  const imageInfo = await sharp(input);
  const imageMetadata = await imageInfo.metadata();
  const imageResizeWidth = imageMetadata.width;
  const imageResizeHeight = imageMetadata.height - 60;

  const imagePath = "/tmp";
  await sharp(input)
    .resize({
      width: imageResizeWidth,
      height: imageResizeHeight,
      position: "left top",
    })
    .toFile(`${imagePath}/${imageFilename}`);

  const imageData = fs.readFileSync(`${imagePath}/${imageFilename}`);
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: process.env.BUCKET_NAME,
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

const getNaverContent = async ($) => {
  const contentArea = $("#dic_area");
  const title = $("title").text();
  const imageUrl = $("#img1")[0].attribs["data-src"];
  const strongText = $("#dic_area > strong").html();
  const strongTextArr = strongText ? strongText.split("<br>") : [];
  shuffle(strongTextArr);

  contentArea.find(".end_photo_org").remove();
  contentArea.find("strong").remove();
  const content = contentArea.html();
  // const description = $("meta").attr("description").text();

  const s3ImageUrl = await imageS3Upload(imageUrl);

  return {
    title,
    s3ImageUrl,
    strongTextArr,
    content,
    tags: [],
  };
};

const getWikitreeContent = async ($) => {
  const contentArea = $(".content");
  const title = $(".article_head > h1").text();
  const imageUrl = $(".article_images_wrap > img")[0].attribs["data-src"];
  const strongText = $("#lead_paragraph").html();
  const strongTextArr = strongText ? strongText.split("<br>") : [];
  const tagsWrap = $(".keyword_wrap > a > span");
  const tags = [];

  for (const tag of tagsWrap) {
    tags.push($(tag).text());
  }
  const content = contentArea.find("p").text();

  const s3ImageUrl = await imageS3Upload(imageUrl);

  return {
    title,
    s3ImageUrl,
    strongTextArr,
    content,
    tags,
  };
};

const getNewsContent = async (req, res, next) => {
  try {
    const { url, category } = req.query;
    if (!url) {
      throw new Error("url parameter");
    }
    if (!category) {
      throw new Error("category parameter");
    }

    const response = await axios(url);
    const $ = cheerio.load(response.data);

    let items = {};

    if (url.includes("naver")) {
      items = await getNaverContent($);
    } else if (url.includes("wikitree")) {
      items = await getWikitreeContent($);
    }

    const reWriteItems = await getRewritePost(items);

    const randomUserInfo = getRandomUser();
    const params = {
      _id: await getNextSequence("postId"),
      category,
      logo: items.s3ImageUrl,
      title: items.title,
      subTitle: items.strongTextArr,
      content: reWriteItems,
      tags: items.tags || [],
      editor: randomUserInfo.editor,
      email: randomUserInfo.email,
      regdate: moment().format("YYYY-MM-DD HH:mm"),
    };

    const newPost = new Post(params);
    const result = await newPost.save();
    console.log(result, "result");

    return res.status(200).send({ status: "ok", items });
    // return res.status(200).send({ status: "ok" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  getKeyword,
  getNewsContent,
};

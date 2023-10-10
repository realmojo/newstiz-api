const Post = require("../../schemas/Posts");
const fs = require("fs");
const AWS = require("aws-sdk");
const sharp = require("sharp");
const moment = require("moment");
const axios = require("axios");
const cheerio = require("cheerio");
const { getNextSequence, getRandomUser, shuffle } = require("./common");
const { start } = require("repl");

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
              content: `${obj.content} 위의 내용을 한글로 뉴스기사 처럼 만들어주세요.`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
  const imageFilename = "output_image.webp";

  // 이미지 다운로드 후 리사이징 아래 로고를 자른다.
  const input = (await axios({ url: imageUrl, responseType: "arraybuffer" }))
    .data;

  const imageInfo = await sharp(input).webp({ lossless: true });
  const imageMetadata = await imageInfo.metadata();
  const imageResizeWidth = imageMetadata.width;
  const imageResizeHeight = imageMetadata.height - 60;

  // const imagePath = "/tmp";
  const imagePath = "./";
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
  let content = contentArea.find("p").text();
  if (content.length > 4000) {
    content = content.substr(0, 4000);
  }

  const s3ImageUrl = await imageS3Upload(imageUrl);

  return {
    title,
    s3ImageUrl,
    strongTextArr,
    content,
    tags,
  };
};

const getInvestingContent = async ($) => {
  const contentArea = $("#leftColumn");
  const title = contentArea.find("h1").text();
  const imageUrl = $("#carouselImage")[0].attribs.src;
  const strongTextArr = [];
  const tags = [];
  contentArea.find(".relatedInstrumentsWrapper").remove();
  let content = contentArea.find(".articlePage > p").text();
  if (content.length > 3800) {
    content = content.substr(0, 3800);
  }
  const s3ImageUrl = await imageS3Upload(imageUrl);
  return {
    title,
    s3ImageUrl,
    strongTextArr,
    content,
    tags,
  };
};

const getDaumContent = async ($) => {
  const contentArea = $("#kakaoContent");
  let title = contentArea.find(".tit_view").text();
  title = title.split("[")[0]
    ? title.split("[")[0].trim()
    : title.split("]")[1].trim();
  const imageUrl = contentArea.find("img")[0].attribs.src;
  const strongTextArr = [];
  const tags = [];
  let contents = contentArea.find(".article_view > section > p");

  const contentArr = [];
  for (const item of contents) {
    const text = $(item).text();

    if (!text.includes("[") && !text.includes("@")) {
      contentArr.push(text);
    }
  }
  let content = contentArr.join(" ");

  if (content.length > 3800) {
    content = content.substr(0, 3800);
  }
  const s3ImageUrl = await imageS3Upload(imageUrl);
  return {
    title,
    s3ImageUrl,
    strongTextArr,
    content,
    tags,
  };
};

const getNaverEntertainContent = async ($) => {
  const contentArea = $("#ct");
  let title = contentArea.find("#title_area").text();
  title = title.split("[")[0]
    ? title.split("[")[0].trim()
    : title.split("]")[1].trim();
  const imageUrl = contentArea.find("#img1")[0].attribs["data-src"];
  const strongTextArr = [];
  const tags = [];
  let content = contentArea.find("#dic_area");

  content.find("span").remove();
  content = content.text();

  if (content.includes("[")) {
    let startIndexOf = content.indexOf("[");
    let endIndexOf = content.indexOf("]");
    let findString = content.substr(startIndexOf, endIndexOf - 2);
    content = content.replace(findString, "");
  }

  if (content.length > 3800) {
    content = content.substr(0, 3800);
  }
  const s3ImageUrl = await imageS3Upload(imageUrl);
  return {
    title,
    s3ImageUrl,
    strongTextArr,
    content,
    tags,
  };
};

const doNewsContent = async (category, url) => {
  const response = await axios(encodeURI(url));
  const $ = cheerio.load(response.data);

  let items = {};

  if (url.includes("entertain")) {
    items = await getNaverEntertainContent($);
  } else if (url.includes("naver")) {
    items = await getNaverContent($);
  } else if (url.includes("wikitree")) {
    items = await getWikitreeContent($);
  } else if (url.includes("investing")) {
    items = await getInvestingContent($);
  } else if (url.includes("daum")) {
    items = await getDaumContent($);
  }
  // console.log(items);
  // return items;

  if (items.content) {
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
    console.log(result, "ok");
    return items;
  }
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

    const items = await doNewsContent(category, url);

    return res.status(200).send({ status: "ok", items });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  getKeyword,
  getNewsContent,
  doNewsContent,
};

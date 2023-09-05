const fs = require("fs");
const AWS = require("aws-sdk");
const axios = require("axios");
const cheerio = require("cheerio");
const sharp = require("sharp");
const env = require("dotenv").config().parsed;
const moment = require("moment");
const Post = require("../../schemas/Posts");
const { randomUser } = require("./constants");

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomUser = () => {
  return randomUser[getRandomNumber(0, getRandomNumber.length)];
};

const shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
};

// const split = data.split("\n");
// console.log(split);
const getRewritePost = async (obj) => {
  console.log(obj);
  return new Promise((resolve, reject) => {
    // const content = `한국 유튜버가 발언한 "1920년대 일본이 한글 보급 지원"이라는 주장은 논란을 일으키고 있습니다. 해당 발언은 일본 언론에도 보도되며 논란의 중심에 있습니다. 유튜버 '용호수' 운영자인 용찬우씨의 과거 발언은 AFPBB를 통해 일본어 기사로 보도되었습니다. 이 영상에서 용씨는 1920년대 일본이 한글을 보급하기 위해 조선인들을 일꾼이나 노예로 사용하기 위해 최소한의 지식을 제공했다고 주장하였습니다. 또한 한문은 동아시아의 공용어이며, 한글은 한국의 것이라는 주장을 매국적이라고 비판하였습니다. 용씨는 더 나아가 "번역기로는 가치 있는 지식을 해석할 수 없으며, 고급 어휘는 음성과 이미지를 통해 이해되어야 한다"고 주장하였습니다. 그는 또한 한글을 조선 왕, 세종이 만든 발음기호로 정의짓고, 한글이 우리의 언어가 아니라면 한글을 사용하는 한국인은 미개한 민족이 된다고 말하였습니다. 이러한 발언은 일본 현지의 기사에서도 동조되며, 한글 비하 댓글도 달렸습니다. 이에 대해서는 여러 의견이 분분하게 제기되고 있습니다.`;

    // const splitData = content.split(". ");
    // const pHtml = splitData.map((item) => `<p>${item}</p>`);
    // console.log(pHtml);

    // resolve(pHtml);
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
          const pHtml = splitData.map((item) => `<p>${item}</p>`);
          console.log(pHtml);

          resolve(pHtml);
          // resolve();
        }
      });
  });
};

const imageS3Upload = async (imageUrl) => {
  const s3 = new AWS.S3({
    accessKeyId: env.NEWSTIZ_ACCESS_KEY_ID,
    secretAccessKey: env.NEWSTIZ_SECRET_KEY_ID,
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
    const strongText = $("#dic_area > strong").html();
    const strongTextArr = strongText ? strongText.split("<br>") : [];
    shuffle(strongTextArr);

    contentArea.find(".end_photo_org").remove();
    contentArea.find("strong").remove();
    const content = contentArea.html();
    // const description = $("meta").attr("description").text();

    const s3ImageUrl = await imageS3Upload(imageUrl);
    // const s3ImageUrl = "";

    // console.log(s3ImageUrl);

    const items = {
      title,
      s3ImageUrl,
      strongTextArr,
      content,
    };
    const reWriteItems = await getRewritePost(items);

    // console.log(reWriteItems);

    const randomUserInfo = getRandomUser();
    const params = {
      // _id: new Date().getTime(),
      category: "world",
      logo: s3ImageUrl,
      title: title,
      subTitle: strongTextArr,
      content: reWriteItems,
      tags: ["세계", "사회 경제"],
      editor: randomUserInfo.editor,
      email: randomUserInfo.email,
      regdate: moment().format("YYYY-MM-DD HH:mm"),
    };

    // console.log(params);

    const newPost = new Post(params);
    const result = await newPost.save();
    console.log(result, "result");

    // _id: { type: Number, require: true, unique: true, index: true },
    // category: { type: String, require: true, trim: true },
    // logo: { type: String, require: true, trim: true },
    // title: { type: String, require: true, trim: true },
    // subTitle: { type: [String], trim: true },
    // content: { type: [String], require: true, trim: true },
    // tags: { type: [String], require: true, trim: true },
    // editor: { type: String, require: true, trim: true },
    // email: { type: String, require: true, trim: true },
    // regdate: { type: String, require: true, trim: true },
    // console.log("dd", d);
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

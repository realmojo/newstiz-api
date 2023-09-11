const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config().parsed;

const app = express();
const port = process.env.PORT || 3001;
console.log(process.env);

// if (process.env.NODE_ENV === "production") {
// } else {
// }
mongoose
  // .connect("mongodb://127.0.0.1:27017/newstiz")
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected!"));
app.use(cors());
app.use("/api/ping", require("./routes/common"));
app.use("/api/newstiz", require("./routes/newstiz"));
app.use("/api/chatgpt", require("./routes/chatgpt"));

app.listen(port, () => {
  console.log("start");
  console.log(`Example app listening on port ${port}`);
});

// 개발
// 1. 실시간 키워드를 가져올 곳을 찾는다.
// 2. 네이버에서 뉴스링크 top 3개 정도만 가져온다.
// 3. 해당 링크의 원문 뉴스에서 텍스트 내용과 제목을 가져온다.
// 4. 챗 gpt를 이용하여 새롭게 재가공 한다.
// 5. 재가공된 뉴스를 적절한 이미지와 내용으로 뉴스 기사를 만든다.
// 6. sns api 를 이용하여 자동 업로드 한다.
// 7. 애드센스 신청

// 마케팅
// 1. 페이스북 광고를 집행하여 구독자 수 10000명을 모은다.
// 2. 조금씩 계속 광고를 하고 주기적으로 페이스북에 계속 올린다.

// // const fetch = require("fetch");

// fetch("https://api.openai.com/v1/chat/completions", {
//   method: "POST",
//   headers: {
//     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "user",
//         content: `<div class="news_cnt_detail_wrap" itemprop="articleBody">
// <div refid="1" class="thumb_area img">  <figure>    <div class="thumb">      <img class="" src="https://wimg.mk.co.kr/news/cms/202308/15/news-p.v1.20230815.63f2c10df8844d7fa5ce137d075a6a61_P1.jpeg" data-src="https://wimg.mk.co.kr/news/cms/202308/15/news-p.v1.20230815.63f2c10df8844d7fa5ce137d075a6a61_P1.jpeg" orgwidth="658" orgheight="471" alt="ㅇ">      <button class="btn btn_ic btn_zoom" data-category_1depth="뉴스" data-category_2depth="뷰" data-section="이미지" data-label="확대보기">        <i class="ic ic_zoom"></i>        <span class="is_blind">사진 확대</span>      </button>    </div>    <figcaption>  <span class="thum_figure_txt">NCT 태일. 사진|SM엔터테인먼트</span>    </figcaption>  </figure></div><p refid="2">아이돌 그룹 NCT의 멤버 태일이 교통사고로 허벅지 골절상을 입고 모든 일정을 중단했다.</p><p refid="3">15일 소속사 SM엔터테인먼트는 “태일이 이날 새벽 일정을 마치고 오토바이로 귀가하던 중 서울 시내에서 교통사고를 당했다”고 밝혔다.</p><p refid="4">태일은 사고 후 즉시 병원으로 옮겨져 정밀검사와 치료를 받았고, 오른쪽 허벅지 골절로 수술이 필요하다는 의료진의 소견을 받았다.</p><p refid="5">SM은 “태일은 수술을 앞두고 병원에서 필요한 치료를 받으며 안정을 취하고 있다”며 “당분간 모든 일정을 중단하고 치료와 회복에 전념할 예정”이라고 설명했다.</p><p refid="6">이어 “갑작스러운 소식으로 팬 여러분께 심려를 끼쳐드려 진심으로 죄송하다는 말씀 드린다”며 “아티스트의 건강을 최우선 순위에 두고 태일이 회복에 집중해 다시 건강한 모습으로 팬 여러분을 만날 수 있도록 최선을 다하겠다”고 덧붙였다.</p><div class="ad_wrap ad_wide">  <!-- MC_article_billboard_1 -->  <div id="MC_article_billboard_1" data-google-query-id="CLjxsdTg4IADFREeYAodTYwHBQ">  <div id="google_ads_iframe_/7450/www.mk.co.kr/news/society_7__container__" style="border: 0pt none;"><iframe id="google_ads_iframe_/7450/www.mk.co.kr/news/society_7" name="google_ads_iframe_/7450/www.mk.co.kr/news/society_7" title="3rd party ad content" width="980" height="320" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" role="region" aria-label="Advertisement" tabindex="0" style="border: 0px; vertical-align: bottom;" data-load-complete="true" data-google-container-id="8"></iframe></div></div></div><p refid="7">이에 따라 태일은 오는 26일 NCT 단체 콘서트 ‘NCT 네이션 : 투 더 월드’(NCT NATION: To The World)에 불참한다.</p><div id="refTotal" value="7"></div>
// </div> 위의 내용을 재작성 해줘`,
//       },
//     ],
//   }),
// })
//   .then((res) => res.json())
//   .then((data) => console.log(JSON.stringify(data, null, 2)));

// const axios = require("axios");
// const cheerio = require("cheerio");
// const log = console.log;

// const getHtml = async () => {
//   try {
//     return await axios.get("https://www.mk.co.kr/news/society/10808069");
//   } catch (error) {
//     console.error(error);
//   }
// };

// getHtml()
//   .then((html) => {
//     console.log(html);
//     // let ulList = [];
//     const $ = cheerio.load(html.data);
//     const $bodyList = $(".news_cnt_detail_wrap").getText();

//     // $bodyList.each(function (i, elem) {
//     //   ulList[i] = {
//     //     title: $(this).find("strong.news-tl a").text(),
//     //     url: $(this).find("strong.news-tl a").attr("href"),
//     //     image_url: $(this).find("p.poto a img").attr("src"),
//     //     image_alt: $(this).find("p.poto a img").attr("alt"),
//     //     summary: $(this).find("p.lead").text().slice(0, -11),
//     //     date: $(this).find("span.p-time").text(),
//     //   };
//     // });

//     // const data = ulList.filter((n) => n.title);
//     return $bodyList;
//   })
//   .then((res) => log(res));

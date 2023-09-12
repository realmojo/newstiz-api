const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config().parsed;

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URL).then(() => console.log("Connected!"));

app.use(cors());
app.use("/api/ping", require("./routes/common"));
app.use("/api/newstiz", require("./routes/newstiz"));
app.use("/api/chatgpt", require("./routes/chatgpt"));
app.use("/", (req, res) => {
  res.status(200).send("hi!");
});

app.listen(port, () => {
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

//server.js
// express 모듈을 불러옴 (웹 서버 프레임워크)
const express = require("express");

// CORS(Cross-Origin Resource Sharing) 설정을 위한 모듈
const cors = require("cors");

// .env 파일에 있는 환경변수를 사용하기 위한 모듈
const dotenv = require("dotenv");

// .env 파일을 실제 환경변수처럼 사용할 수 있도록 설정
dotenv.config();

const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB 연결 성공!"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

// auth 라우터 파일 불러오기
const authRoutes = require("./routes/authRoutes");

// Express 앱 생성
const app = express();

// 포트 번호 설정 (.env에 PORT가 없으면 기본값 5000 사용)
const PORT = process.env.PORT || 5000;

// 모든 요청에서 CORS 허용 (프론트엔드와 서버 포트가 다를 때 필수)
app.use(cors());

// JSON 형태의 요청 바디를 해석할 수 있게 설정 (예: req.body 사용 가능)
app.use(express.json()); // body-parser와 같은 역할

// 라우터 등록 - /api로 시작하는 요청은 authRoutes에서 처리
app.use("/api", authRoutes);

// 테스트용 라우터 - GET 요청이 들어오면 응답으로 문자열 반환
app.get("/", (req, res) => {
  res.send("서버가 정상 작동 중입니다!");
});

// 서버를 지정한 포트에서 실행
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

const protectedRoutes = require("./routes/protectedRoutes");

app.use("/api", protectedRoutes);

//post router
const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes); // 여기서 prefix 설정
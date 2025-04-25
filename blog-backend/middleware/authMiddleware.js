// middleware/authMiddleware.js
// 토큰 인증 로직
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 토큰이 헤더에 포함되지 않은 경우
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "토큰이 제공되지 않았습니다." });
  }

  // "Bearer xxxxxx" 형식에서 실제 토큰만 추출
  const token = authHeader.split(" ")[1];

  try {
    // 토큰 검증 → 성공 시 payload 반환
    const decoded = jwt.verify(token, JWT_SECRET);

    // 사용자 정보(req.user)에 저장 (필요 시 사용)
    req.user = decoded;

    next(); // 다음 미들웨어 또는 라우터로 이동
  } catch (error) {
    return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = verifyToken;

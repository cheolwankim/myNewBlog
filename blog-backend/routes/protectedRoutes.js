// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// 보호된 라우트 (로그인한 사용자만 접근 가능)
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: '이 라우트는 인증된 사용자만 볼 수 있습니다.',
    user: req.user, // 토큰에서 추출된 사용자 정보
  });
});

module.exports = router;

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// 회원가입 라우트 등록
router.post('/register', register);

// 기존 코드 아래에 추가
router.post('/login', login);

module.exports = router;


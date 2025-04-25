const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // 추가
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "이메일과 비밀번호를 입력해주세요." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "이미 가입된 이메일입니다." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  return res.status(201).json({ message: "회원가입이 완료되었습니다." });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "이메일과 비밀번호를 입력해주세요." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
  }

  const token = jwt.sign({ email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json({
    message: "로그인 성공",
    token,
    user: {
      email: user.email,
      _id: user._id,
    },
  });
};

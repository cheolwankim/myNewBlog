const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware"); // 사용 중인 인증 미들웨어만 유지

const {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
} = require("../controllers/postController");

// 게시글 라우트
router.get("/", getAllPosts); // 전체 게시글 조회
router.post("/", verifyToken, createPost); // 게시글 작성
router.get("/:id", getPostById); // 게시글 상세 조회
router.put("/:id", verifyToken, updatePost); // 게시글 수정
router.delete("/:id", verifyToken, deletePost); // 게시글 삭제

// 댓글 라우트
router.post("/:id/comments", verifyToken, addComment); // 댓글 작성
router.put("/:postId/comments/:commentId", verifyToken, updateComment); // 댓글 수정
router.delete("/:postId/comments/:commentId", verifyToken, deleteComment); // 댓글 삭제

module.exports = router;

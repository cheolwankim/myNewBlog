// controllers/postController.js
const Post = require("../models/Post");

// [GET] 전체 게시글 조회
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "게시글 조회 실패", error: err.message });
  }
};

// [POST] 게시글 작성
exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "제목과 내용을 입력해주세요." });
  }

  try {
    if (!req.user) {
      return res.status(400).json({ message: "로그인이 필요합니다." });
    }

    const newPost = new Post({
      title,
      content,
      author: req.user.email, // 로그인한 사용자의 이메일을 작성자로 설정
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: "게시글 작성 성공", post: savedPost });
  } catch (err) {
    res.status(500).json({ message: "게시글 저장 실패", error: err.message });
  }
};

// [GET] 상세 게시글 조회
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "서버 오류입니다." });
  }
};

// [PUT] 게시글 수정
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    if (post.author !== req.user.email) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.status(200).json({ message: "게시글이 수정되었습니다.", post });
  } catch (err) {
    res.status(500).json({ message: "서버 오류입니다." });
  }
};

// [DELETE] 게시글 삭제
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    if (post.author !== req.user.email) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "서버 오류입니다." });
  }
};

// 댓글 추가
exports.addComment = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    post.comments.push({
      content,
      author: req.user.email, // 로그인된 유저 이메일
    });

    await post.save();
    res.status(201).json({ message: "댓글이 추가되었습니다.", post });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
};
// 댓글 수정
exports.updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res
      .status(400)
      .json({ message: "수정할 댓글 내용을 입력해주세요." });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    if (comment.author !== req.user.email) {
      return res.status(403).json({ message: "댓글 수정 권한이 없습니다." });
    }

    comment.content = content;
    await post.save();

    res.status(200).json({ message: "댓글이 수정되었습니다.", comment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "댓글 수정 중 서버 오류", error: err.message });
  }
};
// 댓글 삭제
exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    if (comment.author !== req.user.email) {
      return res.status(403).json({ message: "댓글 삭제 권한이 없습니다." });
    }

    // // ✅ 안전하게 삭제
    // post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    // await post.save();
    // // 이 방식으로 삭제 시도
    post.comments.pull({ _id: commentId });
    await post.save();

    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (err) {
    console.error("댓글 삭제 오류:", err);
    res
      .status(500)
      .json({ message: "댓글 삭제 중 서버 오류", error: err.message });
  }
};

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthContext";

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // fetchPost를 useCallback으로 감쌈
  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      setError("게시글을 불러오는 데 실패했습니다.");
    }
  }, [id]);

  // useEffect에서 fetchPost를 의존성으로 사용
  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDeletePost = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("게시글이 삭제되었습니다.");
      navigate("/");
    } catch (err) {
      alert("삭제에 실패했습니다.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await axios.post(
        `/posts/${id}/comments`,
        { content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPost();
      setCommentContent("");
    } catch (err) {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {    
      await axios.delete(`/posts/${id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchPost();
    } catch (err) {
      alert("댓글 삭제 실패");
    }
  };

  const handleEditStart = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  const handleEditSubmit = async (commentId) => {
    try {
      await axios.put(
        `/posts/${id}/comments/${commentId}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPost();
      setEditingCommentId(null);
      setEditedContent("");
    } catch (err) {
      alert("댓글 수정 실패");
    }
  };

  const isAuthor = user && user.email === post?.author;

  if (error) return <p>{error}</p>;
  if (!post) return <p>로딩 중...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>
        <strong>작성자:</strong> {post?.author || "알 수 없음"}
      </p>

      {isAuthor && (
        <div style={{ marginTop: "20px" }}>
          <Link to={`/edit/${post._id}`}>
            <button style={{ marginRight: "10px" }}>수정</button>
          </Link>
          <button onClick={handleDeletePost}>삭제</button>
        </div>
      )}

      {/* 댓글 목록 */}
      <div style={{ marginTop: "40px" }}>
        <h3>댓글</h3>
        {post.comments?.length > 0 ? (
          <ul>
            {post.comments.map((comment) => (
              <li key={comment._id} style={{ marginBottom: "10px" }}>
                <strong>{comment.author}</strong>:{" "}
                {editingCommentId === comment._id ? (
                  <>
                    <input
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      style={{ marginRight: "8px" }}
                    />
                    <button onClick={() => handleEditSubmit(comment._id)}>
                      저장
                    </button>
                    <button onClick={() => setEditingCommentId(null)}>
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    {comment.content}
                    {user?.email === comment.author && (
                      <>
                        <button
                          style={{ marginLeft: "10px" }}
                          onClick={() =>
                            handleEditStart(comment._id, comment.content)
                          }
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>

      {/* 댓글 작성 */}
      {user && (
        <form
          onSubmit={handleCommentSubmit}
          style={{ marginTop: "20px", display: "flex", gap: "10px" }}
        >
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
            style={{ flex: 1, padding: "8px" }}
          />
          <button type="submit">작성</button>
        </form>
      )}
    </div>
  );
};

export default PostDetailPage;

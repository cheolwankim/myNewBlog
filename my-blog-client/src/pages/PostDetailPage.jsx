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

  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`/posts/${id}`);
      setPost(response.data);
    } catch {
      setError("게시글을 불러오는 데 실패했습니다.");
    }
  }, [id]);

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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      alert("댓글 수정 실패");
    }
  };

  const isAuthor = user && user.email === post?.author;

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return <p className="text-center text-gray-500">로딩 중...</p>;

  return (
  <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    {/* 게시글 본문 */}
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
      {post.title}
    </h2>
    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
      {post.content}
    </p>
    <p className="text-sm text-gray-500 mt-4">
      <strong>작성자:</strong> {post?.author || "알 수 없음"}
    </p>

    {/* 수정/삭제 버튼 */}
    {isAuthor && (
      <div className="mt-4 flex gap-3">
        <Link to={`/edit/${post._id}`}>
          <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg">
            수정
          </button>
        </Link>
        <button
          onClick={handleDeletePost}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          삭제
        </button>
      </div>
    )}

    {/* 댓글 섹션 */}
    <div className="border-t border-gray-300 dark:border-gray-600 mt-8 pt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        댓글 ({post.comments?.length || 0})
      </h3>

      {/* 댓글 목록 */}
      {post.comments?.length > 0 ? (
        <ul className="space-y-4">
          {post.comments.map((comment) => (
            <li
              key={comment._id}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start">
                <strong className="text-gray-900 dark:text-white">
                  {comment.author}
                </strong>
                {user?.email === comment.author && editingCommentId !== comment._id && (
                  <div className="flex gap-2 text-sm">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEditStart(comment._id, comment.content)}
                    >
                      수정
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {editingCommentId === comment._id ? (
                <div className="mt-2 flex gap-2">
                  <input
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                  <button
                    onClick={() => handleEditSubmit(comment._id)}
                              className="text-blue-500 hover:underline font-medium"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                               className="text-red-500 hover:underline font-medium"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <p className="mt-1 text-gray-800 dark:text-gray-200">
                  {comment.content}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">댓글이 없습니다.</p>
      )}

      {/* 댓글 작성 폼 */}
      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-6 flex gap-2">
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm"
          >
            작성
          </button>
        </form>
      )}
    </div>
  </div>
);

};

export default PostDetailPage;

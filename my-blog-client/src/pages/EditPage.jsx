import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthContext";

const EditPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        const post = response.data;

        if (!user || user.email !== post?.author) {
          alert("수정 권한이 없습니다.");
          return navigate("/");
        }

        setTitle(post.title);
        setContent(post.content);
        setLoading(false);
      } catch {
        alert("게시글을 불러오는 데 실패했습니다.");
        navigate("/");
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `/posts/${id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("게시글이 수정되었습니다.");
      navigate(`/posts/${id}`);
    } catch {
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        게시글 수정
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 입력 */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* 내용 입력 */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* 버튼 */}
        <div>
          <button
            type="submit"
            className="text-blue-500 hover:underline font-medium"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPage;

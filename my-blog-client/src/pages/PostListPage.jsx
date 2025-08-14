import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthContext";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const { user, logout } = useAuth();

  // 게시글 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/posts");
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error("응답 형식이 배열이 아닙니다:", response.data);
          setPosts([]);
        }
      } catch (err) {
        console.error("게시글 목록을 불러오는 데 실패했습니다.", err);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">블로그 게시글</h2>

      {/* 로그인 상태에 따라 UI 다르게 */}
      {user ? (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-gray-700 dark:text-gray-200">
            환영합니다, <span className="font-semibold">{user.email}</span>님!
          </span>

          <Link to="/write">
            <button className="text-blue-500 hover:underline font-medium">
              글쓰기
            </button>
          </Link>

          <button
            onClick={logout}
            className="text-red-500 hover:underline font-medium"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="mb-6 space-x-2">
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            로그인
          </Link>

          <Link
            to="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            회원가입
          </Link>
        </div>
      )}

      {/* 게시글 목록 */}
      {Array.isArray(posts) && posts.length > 0 ? (
        <ul className="space-y-5">
          {posts.map((post) => (
            <li
              key={post._id}
              className="border-b pb-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <Link to={`/posts/${post._id}`} className="block">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {post.content?.slice(0, 100)}...
                </p>
                <small className="text-gray-500 dark:text-gray-400">
                  작성자: {post?.author || "알 수 없음"}
                </small>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">게시글이 없습니다.</p>
      )}
    </div>
  );
};

export default PostListPage;

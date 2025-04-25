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
        setPosts(response.data);
      } catch (err) {
        console.error("게시글 목록을 불러오는 데 실패했습니다.", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>블로그 게시글</h2>

      {/* 로그인 상태에 따라 UI 다르게 */}
      {user ? (
        <div style={{ marginBottom: "20px" }}>
          <span>환영합니다, {user.email}님!</span>
          <button onClick={logout} style={{ marginLeft: "10px" }}>
            로그아웃
          </button>
          <Link to="/write">
            <button style={{ marginLeft: "10px" }}>글쓰기</button>
          </Link>
        </div>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <Link to="/login">로그인</Link> / <Link to="/register">회원가입</Link>
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((post) => (
          <li
            key={post._id}
            style={{
              marginBottom: "20px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "10px",
            }}
          >
            <Link to={`/posts/${post._id}`}>
              <h3>{post.title}</h3>
              <p>{post.content.slice(0, 100)}...</p>
              <small>작성자: {post?.author || "알 수 없음"}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostListPage;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthContext";

const EditPage = () => {
  const { id } = useParams(); // 게시글 ID
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

        // 작성자가 아닌 경우 → 메인 페이지로 이동
        if (!user || user.email !== post?.author) {
          alert("수정 권한이 없습니다.");
          return navigate("/");
        }

        setTitle(post.title);
        setContent(post.content);
        setLoading(false);
      } catch (err) {
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
    } catch (err) {
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>게시글 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginTop: "15px" }}>
          <label>내용</label>
          <br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ marginTop: "20px" }}>
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default EditPage;

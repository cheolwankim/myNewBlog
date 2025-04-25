import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axiosInstance";
import { useAuth } from '../contexts/AuthContext';

const WritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // 로그인하지 않았을 경우 /login으로 리디렉션
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/api/posts',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('게시글이 작성되었습니다.');
      navigate('/');
    } catch (err) {
      alert('작성에 실패했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto' }}>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginTop: '15px' }}>
          <label>내용</label><br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ marginTop: '20px' }}>작성하기</button>
      </form>
    </div>
  );
};

export default WritePage;

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 요청 보낼 때마다 localStorage에서 토큰 자동으로 읽어와 헤더에 추가
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // CRA는 REACT_APP_ 여야 함
});

// 요청 보낼 때마다 localStorage에서 토큰 자동으로 읽어와 헤더에 추가
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

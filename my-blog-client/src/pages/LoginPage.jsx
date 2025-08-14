import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "../api/axiosInstance";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/login", { email, password });
      const { token, user } = response.data;

      // 로그인 성공 → Context에 저장 + 페이지 이동
      login(user, token);
      navigate("/");
    } catch (err) {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
          로그인
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 
                         rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 
                         focus:outline-none dark:bg-gray-700 dark:border-gray-600 
                         dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 
                         rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 
                         focus:outline-none dark:bg-gray-700 dark:border-gray-600 
                         dark:text-white"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 
                       text-white font-semibold rounded-lg shadow-md hover:shadow-lg 
                       transform hover:-translate-y-0.5 transition-all duration-200"
          >
            로그인
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          계정이 없으신가요?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

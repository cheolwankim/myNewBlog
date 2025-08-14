import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "../api/axiosInstance";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/register", { email, password });
      const { token, user } = response.data;

      // 회원가입 성공 후 자동 로그인
      login(user, token);
      navigate("/");
    } catch (err) {
      setError("회원가입에 실패했습니다. 이미 등록된 이메일일 수 있습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
          회원가입
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
                         rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 
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
                         rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 
                         focus:outline-none dark:bg-gray-700 dark:border-gray-600 
                         dark:text-white"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-green-400 to-emerald-500 
                       text-white font-semibold rounded-lg shadow-md hover:shadow-lg 
                       transform hover:-translate-y-0.5 transition-all duration-200"
          >
            회원가입
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          이미 계정이 있으신가요?{" "}
          <a
            href="/login"
            className="text-green-500 hover:underline font-medium"
          >
            로그인
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

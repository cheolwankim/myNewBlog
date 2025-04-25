import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserString = localStorage.getItem('user');

    if (storedToken && storedUserString) {
      try {
        const parsedUser = JSON.parse(storedUserString);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("유저 정보 파싱 오류:", error);
        localStorage.removeItem('user'); // 잘못된 데이터일 경우 제거
      }
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

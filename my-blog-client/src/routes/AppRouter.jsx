import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PostListPage from "../pages/PostListPage";
import PostDetailPage from "../pages/PostDetailPage";
import WritePage from "../pages/WritePage";
import EditPage from "../pages/EditPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PostListPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/write" element={<WritePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

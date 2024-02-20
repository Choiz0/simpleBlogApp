import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "pages/home";
import PostList from "pages/posts";
import PostDetail from "pages/posts/detail";
import PostNew from "pages/posts/new";
import PostEdit from "pages/posts/edit";
import ProfilePage from "pages/profile";
import LoginPage from "pages/login";
import SignupPage from "pages/signup";

interface RouterProps {
  isAuthenticated: boolean;
}

const Router = ({ isAuthenticated }: RouterProps) => {
  return (
    <div>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/posts/new" element={<PostNew />} />
            <Route path="/posts/edit/:id" element={<PostEdit />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<LoginPage />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default Router;

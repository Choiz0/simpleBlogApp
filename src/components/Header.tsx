import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        SSBlog
      </Link>
      <div>
        <Link to="posts/new">New Post</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </header>
  );
};

export default Header;

import { Link } from "react-router-dom";
import { BsSun, BsMoonFill } from "react-icons/bs";

import { useContext } from "react";
import ThemeContext from "context/ThemeContext";

const Footer = () => {
  const context = useContext(ThemeContext);
  return (
    <footer>
      <div>
        <Link to="posts/new">New Post</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div>
        {context.theme === "light" ? (
          <BsSun onClick={context.toggleMode} className="footer__theme-btn" />
        ) : (
          <BsMoonFill
            onClick={context.toggleMode}
            className="footer__theme-btn"
          />
        )}
      </div>
    </footer>
  );
};

export default Footer;

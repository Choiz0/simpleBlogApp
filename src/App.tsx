import { useState, useEffect, useContext } from "react";
import { app } from "firebaseApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import Router from "./components/Router";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Loader";
import ThemeContext from "context/ThemeContext";

function App() {
  const context = useContext(ThemeContext);
  const auth = getAuth(app);
  const [init, setInit] = useState<boolean>(false);
  //if firebase auth is true, set isAuthenticated to true

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );
  useEffect(() => {
    // 인증 상태 변화 감지 리스너 등록
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 사용자가 로그인한 경우
        setIsAuthenticated(true);
      } else {
        // 사용자가 로그아웃한 경우
        setIsAuthenticated(false);
      }
      setInit(true);
    });

    // 컴포넌트가 언마운트될 때 리스너 해제
  }, [auth]);

  return (
    <div className={context.theme === "light" ? "white" : "dark"}>
      <ToastContainer />
      {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
    </div>
  );
}

export default App;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { app } from "../firebaseApp";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);

      const currentUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("Login success");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
      const validRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
      if (!value?.match(validRegex)) {
        setError("Invalid email address");
      } else {
        setError("");
      }
    }
    if (name === "password") {
      setPassword(value);
      if (value?.length < 8) {
        setError("Password must be at least 8 characters");
      } else {
        setError("");
      }
    }
  };
  return (
    <>
      {" "}
      <form onSubmit={onSubmit} className="form form--lg">
        <h1 className="form__title">LOGIN</h1>
        <div className="form__block">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form__block">
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        {error && <div className="form__error">{error}</div>}
        <div className="form__block">
          You don't have an account?{" "}
          <Link to="/signup" className="form__link">
            Sign up
          </Link>
          <p>test2@test.com / 12345678</p>
        </div>

        <div className="form__block">
          <input
            type="submit"
            value="Login"
            className="form__btn--submit"
            disabled={error?.length > 0}
          />
        </div>
      </form>
    </>
  );
};

export default LoginForm;

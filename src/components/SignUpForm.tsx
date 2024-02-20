import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../firebaseApp";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

const SignUpForm = () => {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("Sign up success");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
      const validRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
      if (!value.match(validRegex)) {
        setError("Invalid email address");
      } else {
        setError("");
      }
    }
    if (name === "password") {
      setPassword(value);
      if (value.length < 8) {
        setError("Password must be at least 8 characters");
      } else if (passwordConfirm?.length > 0 && value !== passwordConfirm) {
        setError("Password does not match");
      } else {
        setError("");
      }
    }
    if (name === "password_confirm") {
      setPasswordConfirm(value);
      if (value !== password) {
        setError("Password does not match");
      } else {
        setError("");
      }
    }
  };
  return (
    <form onSubmit={onSubmit} className="form form--lg">
      <h1 className="form__title">Register</h1>
      <div className="form__block">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
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
          onChange={onChange}
          required
        />
      </div>
      <div className="form__block">
        <label htmlFor="password_confirm">confirm password </label>
        <input
          type="password"
          name="password_confirm"
          id="password_confirm"
          onChange={onChange}
          required
        />
      </div>
      {error.length > 0 && (
        <div className="form__block">
          <span className="form__error">{error}</span>
        </div>
      )}
      <div className="form__block">
        You already have an account?{" "}
        <Link to="/login" className="form__link">
          Sign in
        </Link>
      </div>

      <div className="form__block">
        <input
          type="submit"
          value="Register"
          className="form__btn--submit"
          disabled={error.length > 0}
        />
      </div>
    </form>
  );
};

export default SignUpForm;

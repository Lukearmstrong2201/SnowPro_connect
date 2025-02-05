import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/");

  return (
    <>
      <p className="login-hero1"> Be Your Best Self</p>
      <p className="login-hero2">START NOW!</p>
      <div className="login-page-container">
        <div className="login-section">
          <h1 className="signInTitle">My Account</h1>
          <h2 className="login-header">Login</h2>
          <form>
            <label className="signin-label" htmlFor="email">
              Username or email address
            </label>
            <input id="email" type="email" placeholder="Enter email address" />

            <label className="signin-label" htmlFor="password">
              Password
            </label>
            <input id="password" type="password" placeholder="Enter Passord" />
            <div className="checkbox-remember">
              <input type="checkbox" id="remember-me" />
              <label className="signin-label" htmlFor="remember-me">
                Remember me
              </label>
            </div>
            <button className="login-button" onClick={handleLoginClick}>
              Login
            </button>
          </form>
          <a href="/" className="lost-password">
            Lost your password?
          </a>
        </div>
      </div>
    </>
  );
}

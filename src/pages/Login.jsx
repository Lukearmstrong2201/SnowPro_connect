import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/");

  return (
    <div className="login-page-container">
      <div className="login-section">
        <h1 className="signInTitle">My Account</h1>
        <h2>Login</h2>
        <form>
          <label htmlFor="email">Username or email address</label>
          <input id="email" type="email" placeholder="Enter email address" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter Passord" />
          <div className="checkbox-remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button onClick={handleLoginClick}>Login</button>
        </form>
        <a href="/" className="lost-password">
          Lost your password?
        </a>
      </div>
    </div>
  );
}

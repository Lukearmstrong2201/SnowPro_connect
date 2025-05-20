import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      // Save user and token to context
      login(data.user, data.access_token);

      navigate("/"); //direct User to hompage upon login
    } catch (error) {
      alert(error.message || "Login failed");
      console.error(error);
    }
  };

  return (
    <>
      <p className="login-hero1">Be Your Best Self</p>
      <p className="login-hero2">START NOW!</p>
      <div className="login-page-container">
        <div className="login-section">
          <h1 className="signInTitle">My Account</h1>
          <h2 className="login-header">Login</h2>
          <form onSubmit={handleLoginClick}>
            <label className="signin-label" htmlFor="email">
              Username or email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="signin-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="checkbox-remember">
              <input type="checkbox" id="remember-me" />
              <label className="signin-label" htmlFor="remember-me">
                Remember me
              </label>
            </div>

            <button className="login-button" type="submit">
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

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import Logo from "./Logo";

export default function Header() {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Logo className="logo-svg" />
          <h1>SnowPro Connect</h1>
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/resorts">Resorts</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <div className="sign-in-buttons">
          <button className="sign-in-button" onClick={handleLoginClick}>
            Sign in
          </button>
          <button className="register-button" onClick={handleRegisterClick}>
            Register
          </button>
        </div>
      </div>
    </header>
  );
}

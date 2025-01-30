import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img src="#" />
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
              <Link to="/booking">Book a Lesson</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <div className="sign-in-buttons">
          <button>Sign in</button>
          <button>Register</button>
        </div>
      </div>
    </header>
  );
}

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";
import Logo from "./Logo";
import defaultProfile from "../assets/profile.png";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");
  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  console.log("Header user:", user);

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
            {/* Conditionally render dashboard link based on user role */}
            {user?.role === "student" && (
              <li>
                <Link to="/dashboard">My Dashboard</Link>
              </li>
            )}
            {user?.role === "instructor" && (
              <li>
                <Link to="/dashboard">Instructor Panel</Link>
              </li>
            )}
            {user?.role === "admin" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          {!user ? (
            <>
              <button className="sign-in-button" onClick={handleLoginClick}>
                Sign in
              </button>
              <button className="register-button" onClick={handleRegisterClick}>
                Register
              </button>
            </>
          ) : (
            <>
              <button className="sign-in-button" onClick={handleLogoutClick}>
                Logout
              </button>
              {user && (
                <img
                  src={
                    user.profile_picture?.startsWith("/static")
                      ? `http://localhost:8000${user.profile_picture}`
                      : user.profile_picture || defaultProfile
                  }
                  alt="Profile"
                  className="header-profile-pic"
                  onClick={() => navigate("/edit-profile")}
                  title="Edit Profile"
                />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

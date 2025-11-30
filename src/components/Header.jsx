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

  // Dynamically generate the correct dashboard link
  const getDashboardLink = () => {
    if (!user) return null;

    switch (user.role) {
      case "student":
        return { path: "/student/dashboard", label: "My Dashboard" };
      case "instructor":
        return { path: "/instructor/dashboard", label: "Instructor Panel" };
      case "admin":
        return { path: "/admin/dashboard", label: "Admin Panel" };
      default:
        return null;
    }
  };

  const dashboard = getDashboardLink();

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Logo className="logo-svg" />
          <h1>SnowPro Connect</h1>
        </div>

        <nav>
          <ul className="nav-links">
            {/* Display public pages ONLY when logged out */}
            {!user && (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/resorts">Resorts</Link>
                </li>
              </>
            )}

            {/* Dashboard link only when logged in */}
            {dashboard && (
              <li>
                <Link to={dashboard.path}>{dashboard.label}</Link>
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

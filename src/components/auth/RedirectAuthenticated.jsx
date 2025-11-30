import { Navigate } from "react-router-dom";

const RedirectAuthenticated = ({ children }) => {
  const role = localStorage.getItem("role");

  if (role) {
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "instructor")
      return <Navigate to="/instructor/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RedirectAuthenticated;

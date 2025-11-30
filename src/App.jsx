import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/HomePage";
import Header from "./components/Header";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resort from "./pages/Resorts";
import About from "./pages/About";
import Booking from "./pages/Booking";
import EditProfile from "./pages/EditProfile";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import RedirectAuthenticated from "./components/auth/RedirectAuthenticated";

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route
            path="/login"
            element={
              <RedirectAuthenticated>
                <Login />
              </RedirectAuthenticated>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectAuthenticated>
                <Register />
              </RedirectAuthenticated>
            }
          />
          <Route
            path="/"
            element={
              <RedirectAuthenticated>
                <Homepage />
              </RedirectAuthenticated>
            }
          />
          <Route path="/about" element={<About />} />

          <Route path="/resorts" element={<Resort />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/booking" element={<Booking />} />

          {/* ---------- STUDENT DASHBOARD ---------- */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* ---------- INSTRUCTOR DASHBOARD ---------- */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["instructor"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          {/* ---------- ADMIN DASHBOARD ---------- */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ---------- UNAUTHORIZED PAGE ---------- */}
          <Route path="/unauthorized" element={<h2>Access Denied</h2>} />

          {/* ---------- DEFAULT FALLBACK ---------- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

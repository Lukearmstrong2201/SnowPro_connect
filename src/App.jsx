import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/HomePage";
import Header from "./components/Header";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resort from "./pages/Resorts";
import About from "./pages/About";
import Booking from "./pages/Booking";
import EditProfile from "./pages/EditProfile";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resorts" element={<Resort />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/booking" element={<Booking />} />
          <Route
            path="/dashboard"
            element={
              user?.role === "student" ? (
                <StudentDashboard />
              ) : user?.role === "instructor" ? (
                <InstructorDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

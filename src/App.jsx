import React from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/HomePage";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resort from "./pages/Resorts";
import About from "./pages/About";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resorts" element={<Resort />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

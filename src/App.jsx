import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/HomePage";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
      </div>

      <Homepage />
    </Router>
  );
}

export default App;

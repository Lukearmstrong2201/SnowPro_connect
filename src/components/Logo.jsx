import React from "react";
import "../styles/Logo.css";

const Logo = () => {
  return (
    <svg
      className="logo-svg"
      width="60"
      height="60"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      {/* Circular background */}
      <circle
        cx="100"
        cy="100"
        r="90"
        stroke="#F0F0F0"
        strokeWidth="8"
        fill="none"
      />

      {/* Ski or snowboard icon */}
      <rect
        x="85"
        y="50"
        width="10"
        height="100"
        fill="#F0F0F0"
        transform="rotate(-20, 90, 100)"
      />
      <rect
        x="105"
        y="50"
        width="10"
        height="100"
        fill="#F0F0F0"
        transform="rotate(20, 110, 100)"
      />

      {/* WiFi Signal */}
      <path
        d="M70 40 Q100 10, 130 40"
        stroke="#F0A500"
        strokeWidth="6"
        fill="none"
      />
      <path
        d="M80 50 Q100 30, 120 50"
        stroke="#F0A500"
        strokeWidth="5"
        fill="none"
      />
      <circle cx="100" cy="60" r="5" fill="#F0A500" />
    </svg>
  );
};

export default Logo;

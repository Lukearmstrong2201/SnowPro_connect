"use client";
import React from "react";
import Wave from "../components/Wave";
import instructorWalk from "../assets/instructor-walk.jpg";
import bookLesson from "../assets/book-with-ease.png";
import stayconnected from "../assets/stay-connected.jpg";
import instructor from "../assets/carving.jpg";
import teamImage from "../assets/teamImage.jpg";
import Mountain from "../components/Mountain";

import { motion } from "framer-motion";
import "../styles/About.css";

export default function About() {
  const sections = [
    {
      title: "Find the Perfect Instructor",
      text: "Browse local instructors near your ski resort and find the right fit for your skill level, goals, and schedule.",
      image: instructorWalk,
      reverse: false,
    },
    {
      title: "Book Lessons with Ease",
      text: "Send a request and receive confirmation all within the platform. No phone calls, no hassle — just skiing.",
      image: bookLesson,
      reverse: true,
    },
    {
      title: "Stay Connected",
      text: "Chat with your instructor directly in the app, ask questions, plan your meet-up, and enjoy the slopes with confidence.",
      image: stayconnected,
      reverse: false,
    },
  ];

  return (
    <>
      <div className="about-hero">
        <Mountain />
        <div className="about-hero-overlay" />
        <img
          src={instructor}
          alt="Snowboard instructor carving"
          className="about-hero-bg"
        />

        <div className="about-hero-content">
          <motion.h1
            className="about-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            We’re here to connect and inspire.
          </motion.h1>

          <p className="about-subtitle">
            Whether you're strapping in for the first time or looking to take
            your skills to the next level, we’re here to help you connect with
            experienced instructors who know your mountain best. SnowPro Connect
            makes it easy to discover, book, and ride — all from your phone.
          </p>
        </div>
      </div>
      <div className="team-container">
        <h2>Meet The Founder</h2>
        <div className="team-section">
          <div className="team-card">
            <p>
              Hi everyone! I'm <strong>Luke</strong>, the founder of this
              platform and a former snowboard instructor. During my time
              teaching, I saw firsthand how overwhelming the demand on ski
              schools can be—leaving many guests without lessons and many
              instructors wishing they had more flexibility.
            </p>
            <p>
              This app was created to solve that problem. I wanted to make it
              easier for guests to find qualified snowboard instructors, give
              instructors the freedom to freelance, and help reduce pressure on
              ski schools during peak seasons.
            </p>
            <p>
              My goal is simple: connect riders with instructors quickly,
              easily, and reliably—so no one misses out on an amazing day on the
              mountain.
            </p>
          </div>

          <div className="team-image-wrapper">
            <img src={teamImage} className="team-image" alt="Founder" />

            <div className="team-info">
              <h3>Luke Armstrong</h3>
              <p>Founder & Developer</p>
              <p>CASI Level 3 Snowboard Instructor</p>
              <p>Freestyle & Backcountry Training</p>
            </div>
          </div>
        </div>
      </div>

      <main className="about-container">
        {sections.map((section, i) => (
          <motion.section
            className={`about-section ${section.reverse ? "reverse" : ""}`}
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="about-card">
              <div className="about-image">
                <div className="about-image-inner">
                  <img
                    src={section.image}
                    alt={section.title}
                    className={
                      section.title === "Book Lessons with Ease"
                        ? "contain-fit"
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="about-text">
                <h2>{section.title}</h2>
                <p>{section.text}</p>
              </div>
            </div>
          </motion.section>
        ))}
      </main>

      <div className="wave-footer">
        <Wave></Wave>
        <div className="wave-fill" />
      </div>
    </>
  );
}

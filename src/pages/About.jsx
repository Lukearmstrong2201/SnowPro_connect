"use client";

import instructorWalk from "../assets/instructor-walk.jpg";
import bookLesson from "../assets/book-with-ease.png";
import stayconnected from "../assets/stay-connected.jpg";
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
      <main className="about-container">
        <motion.h1
          className="about-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Our App
        </motion.h1>

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
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="white"
            d="M0,240 C480,100 960,380 1440,240 L1440,320 L0,320 Z"
          />
        </svg>
        <div className="wave-fill" />
      </div>
    </>
  );
}

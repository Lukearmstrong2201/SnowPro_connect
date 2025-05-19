"use client";

import Wave from "../components/Wave";
import instructorWalk from "../assets/instructor-walk.jpg";
import bookLesson from "../assets/book-with-ease.png";
import stayconnected from "../assets/stay-connected.jpg";
import instructor from "../assets/carving.jpg";
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

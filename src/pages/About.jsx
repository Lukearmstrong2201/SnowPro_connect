"use client";
import Wave from "../components/Wave";
import instructorWalk from "../assets/instructor-walk.jpg";
import bookLesson from "../assets/book-with-ease.png";
import stayconnected from "../assets/stay-connected.jpg";
import instructor from "../assets/carving.jpg";
import SnowParticlesAnimation from "../components/SnowParticlesAnimation";
import Mountain from "../components/Mountain";
import AboutCard from "../components/AboutCard";
import { motion } from "framer-motion";
import "../styles/About.css";
import FounderSection from "../components/FounderSection";

export default function About() {
  const sections = [
    {
      title: "Find the Perfect Instructor",
      text: "Browse local instructors near your ski resort and find the right fit for your skill level, goals, and schedule.",
      image: instructorWalk,
      reverse: false,
      contain: false,
    },
    {
      title: "Book Lessons with Ease",
      text: "Send a request and receive confirmation all within the platform. No phone calls, no hassle — just skiing.",
      image: bookLesson,
      reverse: true,
      contain: true,
    },
    {
      title: "Stay Connected",
      text: "Chat with your instructor directly in the app, ask questions, plan your meet-up, and enjoy the slopes with confidence.",
      image: stayconnected,
      reverse: false,
      contain: false,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="about-hero">
        <SnowParticlesAnimation />

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

      {/*Founder Section*/}
      <div className="team-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Meet The Founder
        </motion.h2>

        <FounderSection />
      </div>

      <main className="about-container">
        {sections.map((section, i) => (
          <AboutCard
            key={i}
            title={section.title}
            text={section.text}
            image={section.image}
            reverse={section.reverse}
            contain={section.contain}
          />
        ))}
      </main>

      <div className="wave-footer">
        <Wave></Wave>
        <div className="wave-fill" />
      </div>
    </>
  );
}

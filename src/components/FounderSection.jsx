import { motion, useScroll, useTransform } from "framer-motion";
import teamImage from "../assets/teamImage.jpg";

export default function FounderSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="team-section">
      <motion.div
        className="team-profile"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Image wrapper with parallax */}
        <motion.div className="profile-image-wrapper" style={{ y }}>
          <img src={teamImage} className="profile-image" alt="Founder" />
        </motion.div>

        {/* Details */}
        <div className="profile-details">
          <h3>Luke Armstrong</h3>
          <p className="role">Founder & Developer</p>

          <ul className="credentials">
            <li>CASI Level 3 Snowboard Instructor</li>
            <li>Freestyle & Backcountry Training</li>
            <li>5+ Years Teaching Experience</li>
          </ul>

          <div className="founder-signature">Luke A.</div>
        </div>
      </motion.div>
      {/* RIGHT SIDE TEXT */}
      <motion.div
        className="team-text"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="intro-quote">
          “My goal is simple — make it easier for people to learn, ride, and
          enjoy the mountain.”
        </div>

        <p>
          Hi everyone! I'm <strong>Luke</strong>, the founder of SnowPro Connect
          and a former snowboard instructor...
        </p>

        <p>
          This platform was created to solve a problem I saw every single
          winter...
        </p>

        <p>
          My mission is simple: connect riders with instructors quickly, easily,
          and reliably.
        </p>
      </motion.div>
    </div>
  );
}

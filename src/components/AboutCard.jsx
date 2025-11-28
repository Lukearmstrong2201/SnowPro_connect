import { motion } from "framer-motion";

export default function AboutCard({ title, text, image, reverse, contain }) {
  return (
    <motion.section
      className={`about-section ${reverse ? "reverse" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="about-card">
        <div className="about-image">
          <div className="about-image-inner">
            <img
              src={image}
              alt={title}
              className={contain ? "contain-fit" : ""}
            />
          </div>
        </div>

        <div className="about-text">
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
      </div>
    </motion.section>
  );
}

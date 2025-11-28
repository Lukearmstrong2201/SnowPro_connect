import { useNavigate } from "react-router-dom";
import "../styles/Homepage.css";
import ObjectivesSection from "../components/ObjectiveSection";
import ReviewsSection from "../components/ReviewSection";
import FeaturesSection from "../components/FeaturesSection";
import Wave from "../components/Wave";

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-content">
          <h1>A life experience that lasts a lifetime</h1>
          <p>
            No queues. No waiting. <strong>Just ride!</strong>
          </p>
          <p>
            Book ski and snowboard lessons in seconds — right from your device.
          </p>
          <button className="cta-button" onClick={() => navigate("/booking")}>
            Get Started
          </button>
        </div>
      </section>

      {/* Objective Section */}
      <ObjectivesSection />

      {/* Feature Section */}
      <FeaturesSection />

      {/* Review Section */}
      <ReviewsSection />

      <Wave></Wave>
    </div>
  );
}

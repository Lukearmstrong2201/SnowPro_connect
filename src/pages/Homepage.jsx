import { useNavigate } from "react-router-dom";
import "../styles/Homepage.css";
import visionImg from "../assets/vision.avif";
import missionImg from "../assets/mission.jpg";
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

      <section>
        <div className="objectives-container">
          <div className="objective-box vision-container">
            <div className="content-wrapper">
              <h3>Vision</h3>
              <img src={visionImg} alt="Vision" />
              <div className="text-container">
                <p>
                  Our vision is to build a connected snowboarding community
                  where every rider—whether a complete beginner or an aspiring
                  pro—can access personalized, high-quality instruction at their
                  favorite Canadian ski resorts. We strive to elevate the sport
                  by empowering local instructors and making snowboarding more
                  approachable, inclusive, and unforgettable for everyone.
                </p>
              </div>
            </div>
          </div>

          <div className="objective-box mission-container">
            <div className="content-wrapper">
              <h3>Mission</h3>
              <img src={missionImg} alt="Mission" />
              <div className="text-container">
                <p>
                  Our mission is to simplify the way snowboarders and skiers
                  connect with certified local instructors. Through our
                  platform, we aim to provide seamless booking experiences,
                  real-time resort insights, and professional feedback—bridging
                  the gap between passionate riders and skilled instructors
                  across Canada’s top ski destinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <FeaturesSection />
      {/* Review Section */}
      <ReviewsSection />
      <Wave></Wave>
    </div>
  );
}

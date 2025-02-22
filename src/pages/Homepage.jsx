import React from "react";
import "../styles/Homepage.css";

export default function Homepage() {
  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to SnowPro Connect</h1>
          <p>
            Book lessons with top ski and snowboard instructors at your favorite
            resorts.
          </p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">What We Offer</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Flexible Bookings With Top Instructors</h3>
            <p>
              You decide when and where you want your booking. You decide your
              instructor level. Prefered language. Ski or Snowboard! We are here
              for you!
            </p>
          </div>
          <div className="feature-card">
            <h3>Personal Dashboard & Progrssion Monitoring</h3>
            <p>
              Browse through highly-rated instructors based on your preferences.
              Receive a personal dashboard with your progress and feeback. Pick
              up where you left of with instructors of your choice.
            </p>
          </div>
          <div className="feature-card">
            <h3>Build custom packages</h3>
            <p>
              Choose customized lesson packages that fit your needs and
              schedule. Personal or group lessons...No Problem!. We create your
              perfect lessons and get you shredding the mountain like a pro.
            </p>
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <h2 className="section-title">User Reviews</h2>
        <div className="review-cards">
          <div className="review-card">
            <p className="review-text">
              "Amazing experience! Learned so much!"
            </p>
            <div className="star-rating">⭐⭐⭐⭐⭐</div>
            <p>- Name</p>
          </div>
          <div className="review-card">
            <p className="review-text">
              "The application works great. Instructors were quick to respond,
              and the user experience was smooth. Highly recommended!"
            </p>
            <div className="star-rating">⭐⭐⭐⭐⭐</div>
            <p>- Name</p>
          </div>
          <div className="review-card">
            <p className="review-text">
              "I had a blast! The lessons were so much fun."
            </p>
            <div className="star-rating">⭐⭐⭐⭐⭐</div>
            <p>- Name</p>
          </div>
          <div className="review-card">
            <p className="review-text">
              "Fantastic service! Highly recommend."
            </p>
            <div className="star-rating">⭐⭐⭐⭐⭐</div>
            <p>- Name</p>
          </div>
        </div>
      </section>
    </div>
  );
}

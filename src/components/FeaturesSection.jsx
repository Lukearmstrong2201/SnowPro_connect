import FeatureCard from "./FeatureCard";

const featureList = [
  {
    title: "Flexible Bookings With Top Instructors",
    description:
      "You decide when and where you want your booking. You choose the instructor level, preferred language — ski or snowboard!",
  },
  {
    title: "Personal Dashboard & Progression Monitoring",
    description:
      "Browse highly-rated instructors and track your progression inside your dashboard. Pick up where you left off anytime.",
  },
  {
    title: "Build Custom Packages",
    description:
      "Create the perfect lesson package for your goals. Personal or group lessons — no problem!",
  },
];

export default function FeaturesSection() {
  return (
    <section className="features-section">
      <h2 className="section-title">What We Offer</h2>

      <div className="features">
        {featureList.map((feature, i) => (
          <FeatureCard
            key={i}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}

import ObjectiveCard from "./ObjectiveCard";
import visionImg from "../assets/vision.avif";
import missionImg from "../assets/mission.jpg";

const objectives = [
  {
    title: "Vision",
    image: visionImg,
    text: "Our vision is to build a connected snowboarding community where every rider—whether a complete beginner or an aspiring pro—can access personalized, high-quality instruction at their favorite Canadian ski resorts. We strive to elevate the sport by empowering local instructors and making snowboarding more approachable, inclusive, and unforgettable for everyone.",
    className: "vision-container",
  },
  {
    title: "Mission",
    image: missionImg,
    text: "Our mission is to simplify the way snowboarders and skiers connect with certified local instructors. Through our platform, we aim to provide seamless booking experiences, real-time resort insights, and professional feedback—bridging the gap between passionate riders and skilled instructors across Canada’s top ski destinations.",
    className: "mission-container",
  },
];

export default function ObjectivesSection() {
  return (
    <section>
      <div className="objectives-container">
        {objectives.map((obj, i) => (
          <ObjectiveCard
            key={i}
            title={obj.title}
            image={obj.image}
            text={obj.text}
            className={obj.className}
          />
        ))}
      </div>
    </section>
  );
}

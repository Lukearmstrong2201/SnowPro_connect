import ReviewCard from "./ReviewCard";

export default function ReviewsSection() {
  const reviews = [
    { text: "Amazing experience! Learned so much!", name: "Name", stars: 5 },
    {
      text: "The application works great. Instructors were quick to respond...",
      name: "Name",
      stars: 4,
    },
    {
      text: "I had a blast! The lessons were so much fun.",
      name: "Name",
      stars: 5,
    },
    { text: "Fantastic service! Highly recommend.", name: "Name", stars: 5 },
  ];

  return (
    <section className="reviews-section">
      <h2 className="section-title">User Reviews</h2>

      <div className="review-cards">
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            text={review.text}
            name={review.name}
            stars={review.stars}
          />
        ))}
      </div>
    </section>
  );
}

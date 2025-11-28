export default function ReviewCard({ text, name, stars = 5 }) {
  const starString = "⭐".repeat(stars);

  return (
    <div className="review-card">
      <p className="review-text">"{text}"</p>
      <div className="star-rating">{starString}</div>
      <p>- {name}</p>
    </div>
  );
}

// src/components/icons/StarRating.jsx
import { Star, StarHalf, StarOff } from "lucide-react";

export default function StarRating({ rating = 0, size = 20 }) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  for (let i = 0; i < full; i++) {
    stars.push(<Star key={`full-${i}`} size={size} className="icon-white" />);
  }

  if (half) {
    stars.push(<StarHalf key="half" size={size} className="icon-white" />);
  }

  while (stars.length < 5) {
    stars.push(
      <StarOff
        key={`empty-${stars.length}`}
        size={size}
        className="icon-white"
      />
    );
  }

  return <div className="star-rating">{stars}</div>;
}

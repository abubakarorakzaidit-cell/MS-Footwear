import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating = 4.5, size = 14 }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`Rated ${rating} out of 5`}>
      {stars.map((s) =>
        s <= Math.round(rating) ? <FaStar key={s} size={size} /> : <FaRegStar key={s} size={size} />
      )}
    </div>
  );
};

export default StarRating;

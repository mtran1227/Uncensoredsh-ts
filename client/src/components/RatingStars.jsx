import React from "react";

const RatingStars = ({ value, onChange }) => {
  return (
    <div className="flex gap-2 justify-center my-4">
      {[1,2,3,4,5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          className={`text-5xl cursor-pointer ${
            value >= star ? "text-blue-600" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;

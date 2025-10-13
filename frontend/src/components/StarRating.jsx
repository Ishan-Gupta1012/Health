import React from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';

const StarRating = ({ rating }) => {
  const numericRating = parseFloat(rating) || 0;

  const fullStars = Math.floor(numericRating);
  const halfStar = numericRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  if (numericRating <= 0) {
    return (
        <div className="flex items-center text-gray-400">
            <StarOff size={16} className="mr-2" />
            <span className="text-xs font-medium">No Rating Available</span>
        </div>
    );
  }

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={16} className="text-yellow-400 fill-current" />
      ))}
      {halfStar && <StarHalf size={16} className="text-yellow-400 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={16} className="text-gray-300 fill-current" />
      ))}
      <span className="ml-2 text-sm font-medium text-black/70">{numericRating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
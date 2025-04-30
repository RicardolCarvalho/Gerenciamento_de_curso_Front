import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating,
  size = "md" 
}) => {
  // Map size to pixel values
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  
  const starSize = sizeMap[size];
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={starSize}
          className={`${
            star <= rating
              ? "text-yellow-500 fill-yellow-500"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
};
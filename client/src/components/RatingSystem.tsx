import React, { useState } from 'react';

interface RatingSystemProps {
  maxRating?: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showLabels?: boolean;
  labels?: string[];
}

const RatingSystem: React.FC<RatingSystemProps> = ({
  maxRating = 5,
  initialRating = 0,
  onRatingChange,
  size = 'md',
  readonly = false,
  showLabels = false,
  labels = ['سيء جداً', 'سيء', 'متوسط', 'جيد', 'ممتاز']
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleClick = (newRating: number) => {
    if (readonly) return;
    
    setRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleMouseEnter = (newRating: number) => {
    if (readonly) return;
    setHoverRating(newRating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const getStarColor = (index: number) => {
    const currentRating = hoverRating || rating;
    return index < currentRating ? 'text-yellow-400' : 'text-gray-300';
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex space-x-1" role="radiogroup" aria-label="تقييم">
        {Array.from({ length: maxRating }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`${sizeClasses[size]} transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded`}
            onClick={() => handleClick(index + 1)}
            onMouseEnter={() => handleMouseEnter(index + 1)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            aria-label={`تقييم ${index + 1} من ${maxRating}`}
            role="radio"
            aria-checked={index < rating}
          >
            <svg
              className={`w-full h-full ${getStarColor(index)}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      
      {showLabels && rating > 0 && (
        <p className="text-sm text-gray-600 text-center">
          {labels[rating - 1] || `تقييم ${rating} من ${maxRating}`}
        </p>
      )}
      
      {!readonly && (
        <p className="text-xs text-gray-500 text-center">
          انقر على النجوم للتقييم
        </p>
      )}
    </div>
  );
};

export default RatingSystem;

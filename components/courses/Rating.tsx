'use client';

import React, { useEffect } from 'react';
import ReactStars from 'react-rating-star-with-type';
import { useDictionary } from '@/components/hooks';
import { cn } from '@/components/utils';

interface RatingProps {
  isEditable?: boolean;
  rating?: number;
  className?: string;
}

export default function Rating({ isEditable, rating, className }: RatingProps) {
  const [stars, setStars] = React.useState(rating || 0);

  useEffect(() => {
    setStars(rating);
  }, [rating]);

  const handleChange = (newRating: number) => {
    if (1 > newRating || newRating > 5) {
      return;
    }
    setStars(newRating);
  };

  const dictionary = useDictionary('courses');

  return (
    <div
      className={cn(
        'flex flex-row justify-between items-center gap-2',
        className,
      )}
    >
      <label htmlFor="rating">{dictionary['rating']}</label>
      <input type="hidden" id="rating" name="rating" value={stars} />
      <ReactStars
        count={5}
        value={stars}
        onChange={handleChange}
        size={24}
        isEdit={isEditable}
      />
    </div>
  );
}

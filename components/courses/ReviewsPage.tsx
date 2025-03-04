'use client';

import { ReviewWithUserDto } from '@/lib/dto/review.dto';
import ReviewCard from '@/components/courses/ReviewCard';
import ReviewForm from '@/components/courses/ReviewForm';
import { useDictionary } from '@/components/hooks';
import ReactStars from 'react-rating-star-with-type';
import { CoursePublishPageDto } from '@/lib/dto/course.dto';

interface ReviewsPageProps {
  course: CoursePublishPageDto;
  reviews: ReviewWithUserDto[];
  isSignedUp: boolean;
  courseId: string;
  slug: string;
}

export default function ReviewsPage({
  course,
  reviews,
  isSignedUp,
  courseId,
  slug,
}: ReviewsPageProps) {
  const dictionary = useDictionary('courses');

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 gap-8">
      <div className="w-full flex justify-center flex-col items-center">
        <h2 className="text-3xl font-bold mb-8">
          {dictionary['reviews']}
        </h2>
        {course.averageRating !== 0 && (
          <ReactStars isHalf={true} value={course.averageRating} size={32} />
        )}
      </div>
      <ReviewForm courseId={courseId} isSignedUp={isSignedUp} slug={slug} />
      <div className="w-full flex flex-row flex-wrap gap-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.userId} review={review} />
          ))
        ) : (
          <p className="w-full text-center text-gray-500">
            {dictionary['no-reviews']}
          </p>
        )}
      </div>
    </div>
  );
}

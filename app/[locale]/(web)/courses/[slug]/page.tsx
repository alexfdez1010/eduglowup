import CoursePage from '@/components/courses/CoursePage';
import ReviewsPage from '@/components/courses/ReviewsPage';
import { courseService } from '@/lib/services/course-service';
import { profileService } from '@/lib/services/profile-service';
import { reviewService } from '@/lib/services/review-service';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const course = await courseService.getCourseBySlug(slug);

  return {
    title: `EduGlowUp - ${course.title}`,
    description: course.description,
  };
}

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const course = await courseService.getCourseBySlug(slug);

  if (course === null) {
    notFound();
  }

  const [isSignedUp, reviews, profileOfInstructor] = await Promise.all([
    courseService.isSignedUp(course.id),
    reviewService.getReviewsOfCourse(course.id),
    profileService.getUserProfile(course.ownerId),
  ]);

  return (
    <>
      <CoursePage
        course={course}
        profileOfInstructor={profileOfInstructor}
        isSignedUp={isSignedUp}
      />
      <ReviewsPage
        course={course}
        reviews={reviews}
        isSignedUp={isSignedUp}
        courseId={course.id}
        slug={slug}
      />
    </>
  );
}

import { PublishForm } from '@/components/publish/PublishForm';
import { courseService } from '@/lib/services/course-service';
import { guardService } from '@/lib/services/guard-service';
import { notFound } from 'next/navigation';

export default async function PublishCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const courseId = params.id;

  if (!courseId) {
    return notFound();
  }

  const userHasAccess = await guardService.userIsOwnerOfCourse(courseId);

  if (!userHasAccess) {
    return notFound();
  }

  const course = await courseService.getPublishedCourseById(courseId);

  const keywords = await courseService.getKeywords(course.keywordsIds);

  return <PublishForm course={course} keywords={keywords} />;
}

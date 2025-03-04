import { courseService } from '@/lib/services/course-service';
import CoursesCreate from '@/components/courses/CoursesCreate';

export default async function Create({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const courses = await courseService.getOwnedCourses();

  return <CoursesCreate courses={courses} />;
}

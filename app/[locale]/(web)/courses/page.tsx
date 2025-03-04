import { LocalePageProps } from '@/app/[locale]/interfaces';
import { courseService } from '@/lib/services/course-service';
import CourseExplorationList from '@/components/courses/preview/CourseExplorationList';

export default async function Home({ params }: LocalePageProps) {
  const courses = await courseService.getPublishedCourses();

  return (
    <div className="flex flex-col gap-6 w-full justify-center items-center">
      <CourseExplorationList courses={courses} />
    </div>
  );
}

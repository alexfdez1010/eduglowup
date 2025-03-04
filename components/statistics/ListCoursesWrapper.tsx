import { getDictionary } from '@/app/[locale]/dictionaries';
import ListStatistics from '@/components/statistics/ListStatistics';
import { courseService } from '@/lib/services/course-service';

interface ListCoursesProps {
  locale: string;
}

export default async function ListCoursesWrapper({ locale }: ListCoursesProps) {
  const dictionary = getDictionary(locale)['statistics'];

  const courses = await courseService.getSignedUpCourses();

  const items = courses.map((course) => ({
    name: course.title,
    link: `/app/statistics/course/${course.id}`,
    progress: course.progress,
  }));

  return <ListStatistics title={dictionary['courses']} items={items} />;
}

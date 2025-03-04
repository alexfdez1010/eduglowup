import { courseService } from '@/lib/services/course-service';
import CourseList from '@/components/courses/CourseList';
import { LocalePageProps } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import CoursesHeader from '@/components/courses/CoursesHeader';
import StreakHeaderWrapper from '@/components/streak/StreakHeaderWrapper';
import { Reward } from '@/lib/reward/reward';
import RewardsWrapper from '@/components/rewards/RewardsWrapper';

export default async function Courses({ params: { locale } }: LocalePageProps) {
  const courses = await courseService.getSignedUpCourses();

  const dictionary = getDictionary(locale)['courses'];

  return (
    <>
      <StreakHeaderWrapper />
      <RewardsWrapper />
      <CoursesHeader
        title={dictionary['title']}
        cta={dictionary['explore-courses']}
        action="/courses"
      />
      <CourseList courses={courses} />
    </>
  );
}

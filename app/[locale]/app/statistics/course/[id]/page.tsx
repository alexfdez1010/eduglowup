import { LocalePagePropsWithId } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import ListStatistics from '@/components/statistics/ListStatistics';
import { authProvider } from '@/lib/providers/auth-provider';
import { contentService } from '@/lib/services/content-service';
import { courseService } from '@/lib/services/course-service';

export default async function Page({ params }: LocalePagePropsWithId) {
  const dictionary = getDictionary(params.locale)['statistics'];
  const courseId = params.id;

  const [course, contents] = await Promise.all([
    courseService.getCourse(courseId),
    contentService.getContentsOfCourse(courseId),
  ]);

  const items = contents.map((content) => ({
    name: content.filename,
    progress: content.progress,
    link: `/app/statistics/content/${content.id}`,
  }));

  return (
    <div className="flex flex-col justify-center items-center h-full w-full mt-24">
      <ListStatistics title={course.title} items={items} />
    </div>
  );
}

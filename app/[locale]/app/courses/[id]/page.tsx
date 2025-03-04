import { getDictionary } from '@/app/[locale]/dictionaries';
import { LocalePagePropsWithId } from '@/app/[locale]/interfaces';
import Contents from '@/components/content/Contents';
import ContentsSkeleton from '@/components/content/ContentsSkeleton';
import HeaderContent from '@/components/content/HeaderContents';
import Title from '@/components/general/Title';
import { courseService } from '@/lib/services/course-service';
import { guardService } from '@/lib/services/guard-service';
import { Divider } from '@nextui-org/react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CurrentProgress from '@/components/courses/CurrentProgress';

export default async function Page({ params }: LocalePagePropsWithId) {
  const courseId = params.id;

  const [course, isOwner] = await Promise.all([
    courseService.getCourse(courseId),
    guardService.userIsOwnerOfCourse(courseId),
  ]);

  if (!course) {
    notFound();
  }

  const dictionary = getDictionary(params.locale)['courses'];
  const statisticsDictionary = getDictionary(params.locale)['statistics'];

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 w-full">
        <Title title={course.title} />
        <CurrentProgress courseId={courseId} localeDictionary={statisticsDictionary} />
      </div>
      <HeaderContent
        localeDictionary={dictionary}
        courseId={courseId}
        isOwner={isOwner}
      />
      <Divider className="w-full" />
      <Suspense fallback={<ContentsSkeleton />}>
        <Contents courseId={courseId} />
      </Suspense>
    </>
  );
}

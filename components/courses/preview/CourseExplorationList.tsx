'use client';

import { useDictionary } from '@/components/hooks';
import { CoursePublishedDto } from '@/lib/dto/course.dto';
import CourseExplorationItem from '@/components/courses/preview/CourseExplorationItem';
import Title from '@/components/general/Title';

interface CourseExplorationListProps {
  courses: CoursePublishedDto[];
}

export default function CourseExplorationList({
  courses,
}: CourseExplorationListProps) {
  const dictionary = useDictionary('courses');

  return (
    <>
      <Title title={dictionary['courses']} className="mt-24" />
      <div className="flex flex-row flex-wrap gap-6 items-center justify-center w-full max-w-3xl mt-24">
        {courses.map((course) => (
          <CourseExplorationItem key={course.slug} course={course} />
        ))}
      </div>
    </>
  );
}

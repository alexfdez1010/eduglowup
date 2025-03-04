'use client';

import { OwnedCourseDto } from '@/lib/dto/course.dto';
import { useDictionary } from '@/components/hooks';
import OwnedCourse from '@/components/courses/OwnedCourse';

interface OwnedCourseListProps {
  courses: OwnedCourseDto[];
}

export default function OwnedCourseList({ courses }: OwnedCourseListProps) {
  const dictionary = useDictionary('courses');

  return (
    <div className="flex flex-col gap-4 mt-16 w-full">
      {courses.length === 0 ? (
        <div className="text-center text-default-500">
          {dictionary['no-owned-courses']}
        </div>
      ) : (
        courses.map((course) => <OwnedCourse key={course.id} course={course} />)
      )}
    </div>
  );
}

'use client';

import { CourseWithProgressDto } from '@/lib/dto/course.dto';
import Course from '@/components/courses/Course';
import { useDictionary } from '@/components/hooks';

interface CourseListProps {
  courses: CourseWithProgressDto[];
}

export default function CourseList({ courses }: CourseListProps) {
  const dictionary = useDictionary('courses');

  return (
    <div className="flex flex-col gap-6 mt-8 w-full">
      {courses.length === 0 ? (
        <div className="text-center text-default-500 mt-8">
          <p>{dictionary['no-courses']}</p>
        </div>
      ) : (
        courses.map((course) => <Course key={course.id} course={course} />)
      )}
    </div>
  );
}

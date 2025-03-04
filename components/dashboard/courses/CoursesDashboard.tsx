'use client';

import { useEffect, useState } from 'react';
import { CourseWithOwnerDto } from '@/lib/dto/course.dto';
import { getCourses } from '@/lib/actions/courses';
import CourseCardPreview from '@/components/dashboard/courses/CourseCardPreview';
import Title from '@/components/general/Title';

export default function CoursesDashboard() {
  const courses = useCourses();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-12">
      <Title title="Courses" />
      <div className="flex flex-wrap justify-center items-center gap-4 mt-16 w-full">
        {courses.map((course) => (
          <CourseCardPreview key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

const useCourses = () => {
  const [courses, setCourses] = useState<CourseWithOwnerDto[]>([]);

  useEffect(() => {
    getCourses().then((response) => {
      if (response.isError) {
        console.error(response.message);
      } else {
        setCourses(response.courses);
      }
    });
  }, []);

  return courses;
};

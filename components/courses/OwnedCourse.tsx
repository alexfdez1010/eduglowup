'use client';

import { OwnedCourseDto } from '@/lib/dto/course.dto';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import { Chip } from '@nextui-org/chip';
import { useDictionary } from '@/components/hooks';
import { getLanguageLabel } from '@/common/language';

interface OwnedCourseProps {
  course: OwnedCourseDto;
}

export default function OwnedCourse({ course }: OwnedCourseProps) {
  const dictionary = useDictionary('courses');

  return (
    <div className="flex flex-row justify-between items-center w-full">
      <Link
        as={NextLink}
        href={`/app/courses/${course.id}`}
        className="text-lg font-medium"
        data-cy="explore-course-link"
      >
        {course.title}
      </Link>
      <div className="flex flex-row gap-2">
        <Chip
          variant="flat"
          color="primary"
          classNames={{
            base: 'max-w-fit',
          }}
        >
          {getLanguageLabel(course.language)}
        </Chip>
        <Chip
          variant="flat"
          color={course.state === 'Published' ? 'success' : 'default'}
          classNames={{
            base: 'max-w-fit',
          }}
        >
          {dictionary[course.state]}
        </Chip>
      </div>
    </div>
  );
}

'use client';

import { CourseWithProgressDto } from '@/lib/dto/course.dto';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import { Chip } from '@nextui-org/chip';
import { getLanguageLabel } from '@/common/language';
import { useDictionary } from '@/components/hooks';
import { Tooltip } from '@nextui-org/react';
import CircularPercentage from '@/components/general/CircularPercentage';

interface CourseProps {
  course: CourseWithProgressDto;
}

export default function Course({ course }: CourseProps) {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-row justify-center items-center gap-2">
        <Link
          as={NextLink}
          href={`/app/courses/${course.id}`}
          className="text-lg font-medium"
        >
          {course.title}
        </Link>
        <Chip
          variant="flat"
          color="primary"
          classNames={{
            base: 'max-w-fit',
          }}
        >
          {getLanguageLabel(course.language)}
        </Chip>
      </div>
      <CourseStatistics course={course} />
    </div>
  );
}

function CourseStatistics({ course }: CourseProps) {
  const dictionary = useDictionary('statistics');

  return (
    <Tooltip content={dictionary['statistics']} color="primary" showArrow>
      <Link href={`/app/statistics/course/${course.id}`} color="foreground">
        <CircularPercentage value={course.progress} size="lg" />
      </Link>
    </Tooltip>
  );
}

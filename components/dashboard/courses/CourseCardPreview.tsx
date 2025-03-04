import { Card, CardHeader } from '@nextui-org/card';
import { CardBody, Link } from '@nextui-org/react';
import { CourseWithOwnerDto } from '@/lib/dto/course.dto';

import NextLink from 'next/link';

interface CourseCardPreviewProps {
  course: CourseWithOwnerDto;
}

export default function CourseCardPreview({ course }: CourseCardPreviewProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col justify-center items-center4">
        <h2 className="text-2xl font-bold p-2">{course.title}</h2>
        <p>{course.ownerName}</p>
      </CardHeader>
      <CardBody className="flex flex-col justify-center items-center gap-5">
        <Link as={NextLink} href={`/app/courses/${course.id}`}>
          Go to course
        </Link>
      </CardBody>
    </Card>
  );
}

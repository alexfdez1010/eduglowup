import { Button } from '@nextui-org/button';
import NextLink from 'next/link';

interface CoursesHeaderProps {
  title: string;
  cta: string;
  action: (() => void) | string;
}

export default function CoursesHeader({
  title,
  cta,
  action,
}: CoursesHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <h1 className="text-2xl font-bold">{title}</h1>
      <ButtonCourse cta={cta} action={action} />
    </div>
  );
}

function ButtonCourse({
  cta,
  action,
}: {
  cta: string;
  action: (() => void) | string;
}) {
  if (typeof action === 'string') {
    return (
      <Button
        as={NextLink}
        href={action}
        color="primary"
        data-cy="explore-course-button"
      >
        {cta}
      </Button>
    );
  }

  return (
    <Button color="primary" onPress={action} data-cy="create-course-button">
      {cta}
    </Button>
  );
}

import ExerciseSelectionWrapper from '@/components/content/ExerciseSelectionWrapper';
import UploadContent from '@/components/content/UploadContent';
import { Button } from '@nextui-org/react';

import NextLink from 'next/link';

interface HeaderContentProps {
  localeDictionary: Record<string, string>;
  courseId: string;
  isOwner: boolean;
}

export default function HeaderContent({
  localeDictionary,
  courseId,
  isOwner,
}: HeaderContentProps) {
  return (
    <div className="flex flex-row flex-wrap md:justify-between justify-center items-center w-full gap-3">
      {isOwner && (
        <>
          <UploadContent showReuseContent={!!courseId} />
          {courseId && (
            <Button
              as={NextLink}
              href={`/app/courses/${courseId}/publish`}
              color="danger"
            >
              {localeDictionary['publish']}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

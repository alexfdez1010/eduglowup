import { useDictionary } from '@/components/hooks';
import { Button, Tooltip } from '@nextui-org/react';
import { BookCheck } from 'lucide-react';

import NextLink from 'next/link';

interface GoToContentProps {
  contentId: string;
  courseId?: string;
  useTooltip?: boolean;
}

export default function GoToContent({
  contentId,
  courseId,
  useTooltip = false,
}: GoToContentProps) {
  const dictionary = useDictionary('content');

  const url = courseId
    ? `/app/courses/${courseId}/content/${contentId}`
    : `/app/content/${contentId}`;

  if (useTooltip) {
    return (
      <Tooltip
        content={dictionary['go-to-content']}
        color="primary"
        showArrow
        placement="left"
      >
        <Button
          as={NextLink}
          href={url}
          color="primary"
          isIconOnly
        >
          <BookCheck className="size-5" />
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button as={NextLink} href={url} color="primary">
      {dictionary['go-to-content']}
    </Button>
  );
}

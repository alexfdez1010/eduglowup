import { useRef, useEffect } from 'react';
import { SummaryDto } from '@/lib/dto/summary.dto';
import MarkdownComplete from '../general/MarkdownComplete';
import { Button, Tooltip } from '@nextui-org/react';
import NextLink from 'next/link';
import { Edit } from 'lucide-react';
import { useDictionary } from '@/components/hooks';

interface SummaryProps {
  summary: SummaryDto;
  isOwner: boolean;
}

export default function Summary({ summary, isOwner }: SummaryProps) {
  const dictionary = useDictionary('content');

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = -10000;
    }
  }, [summary]);

  return (
    <div className="flex flex-col justify-start items-center gap-5 md:w-[600px]">
      <div className="flex flex-row justify-between items-center w-full gap-6">
        <h1 className="font-bold text-4xl mb-6 w-full">{summary.title}</h1>
        {isOwner && (
          <Tooltip
            content={dictionary['edit-summary']}
            color="primary"
            showArrow
          >
            <Button
              as={NextLink}
              href={`/app/content/${summary.contentId}/summaries/${summary.order}/edit`}
              color="primary"
              isIconOnly
              radius="full"
              aria-label={dictionary['edit-summary']}
            >
              <Edit className="size-5 self-center" />
            </Button>
          </Tooltip>
        )}
      </div>
      <div ref={scrollRef} className="flex flex-col gap-4">
        <MarkdownComplete text={summary.markdown} />
      </div>
    </div>
  );
}

'use client';

import { Pagination } from '@nextui-org/pagination';
import Summary from '@/components/summary/Summary';
import { useRouter } from 'next/navigation';
import { DocumentDto } from '@/lib/dto/document.dto';
import { ExerciseSelection } from '@/components/content/ExerciseSelection';
import { StartSessionContentButton } from '@/components/content/StartSessionContentButton';
import AskSummary from '@/components/summary/AskSummary';
import NotLoggedDialog from '@/components/content/NotLoggedDialog';
import { SummaryDto } from '@/lib/dto/summary.dto';
import GoToContent from '../content/GoToContent';

interface ContentSummaryProps {
  document: DocumentDto;
  summary: SummaryDto;
  partId: string;
  order: number;
  numberOfParts: number;
  exercisesNames: string[];
  isOwner: boolean;
  courseId?: string;
}

export default function ContentSummary({
  document,
  summary,
  partId,
  order,
  numberOfParts,
  exercisesNames,
  isOwner,
  courseId,
}: ContentSummaryProps) {
  const router = useRouter();

  const baseUrl = courseId
    ? `/app/courses/${courseId}/content/${summary.contentId}`
    : `/app/content/${summary.contentId}`;

  const handleChangePage = (index: number) => {
    router.push(`${baseUrl}/summaries/${index}`);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full gap-5">
      <div className="flex flex-col justify-center items-center mb-[22vh] w-11/12">
        <Summary summary={summary} isOwner={isOwner} />
      </div>
      <div className="fixed bottom-0 h-[20vh] z-999 bg-background w-screen flex flex-col justify-center items-center mt-5 gap-5">
        <Pagination
          total={numberOfParts}
          color="primary"
          page={order}
          onChange={handleChangePage}
          showControls
          isCompact
          size="lg"
        />
        <div className="flex flex-row flex-wrap gap-3 justify-evenly items-center w-full max-w-2xl mb-1">
          <GoToContent contentId={document.id} courseId={courseId} />
          <ExerciseSelection exercisesNames={exercisesNames} />
          <StartSessionContentButton document={document} />
        </div>
        <div className="fixed bottom-[22.5%] right-[10%] md:right-[15%] lg:right-[20%] xl:right-[25%]">
          <AskSummary partId={partId} documentId={document.id} order={order} />
        </div>
      </div>
      <NotLoggedDialog />
    </div>
  );
}

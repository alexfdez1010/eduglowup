import { useSummary } from '@/components/summary/use-summary';
import { useDictionary, useLocale } from '@/components/hooks';
import { Tip, useTip } from '@/components/general/Tip';
import Summary from '@/components/summary/Summary';

interface SessionSummaryProps {
  documentId: string;
  partOrder: number;
}

export default function SessionSummary({
  documentId,
  partOrder,
}: SessionSummaryProps) {
  const dictionaryDocuments = useDictionary('content');
  const locale = useLocale();

  const summary = useSummary(documentId, partOrder);

  const tip = useTip(locale);

  if (!summary) {
    return (
      <div className="flex flex-col justify-center items-center w-11/12 h-48">
        <Tip
          tip={tip}
          labelProgress={dictionaryDocuments['creating-summary']}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Summary summary={summary} isOwner={false} />
    </div>
  );
}

import AskButton from '@/components/chat/AskButton';

interface AskSummaryProps {
  documentId: string;
  order: number;
  partId: string;
}

export default function AskSummary({
  documentId,
  order,
  partId,
}: AskSummaryProps) {
  return (
    <AskButton
      isInPart={true}
      documentId={documentId}
      order={order}
      idForChat={partId}
    />
  );
}

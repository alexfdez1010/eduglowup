import { SummaryDto } from '@/lib/dto/summary.dto';
import { useEffect, useState } from 'react';

export const useSummary = (
  documentId: string,
  partOrder: number,
): SummaryDto | null => {
  const [summary, setSummary] = useState<SummaryDto | null>(null);

  useEffect(() => {
    if (!summary) {
      fetch(`/api/summary/${documentId}/${partOrder}`)
        .then((response) => response.json())
        .then((data) => data.summary)
        .then((summary: SummaryDto) => {
          setSummary(summary);
        });
    }
  }, [summary, documentId, partOrder]);

  return summary;
};

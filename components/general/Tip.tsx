'use client';

import { Progress } from '@nextui-org/progress';
import { useEffect, useState } from 'react';
import { Skeleton } from '@nextui-org/skeleton';

interface TipProps {
  tip: string;
  labelProgress: string;
}

export function Tip({ tip, labelProgress }: TipProps) {
  return (
    <div className="flex flex-col gap-4 w-11/12">
      <div className="w-full">
        {tip ? (
          <p className="font-bold">{tip}</p>
        ) : (
          <>
            <Skeleton className="h-5 w-full rounded-lg mb-2" />
            <Skeleton className="h-5 w-full rounded-lg" />
          </>
        )}
      </div>
      <Progress
        color="primary"
        label={labelProgress}
        className="w-full"
        size="lg"
        isIndeterminate
      />
    </div>
  );
}

export const useTip = (locale: string) => {
  const urlTips = `/api/tip/${locale}`;
  const [tip, setTip] = useState<string>('');

  useEffect(() => {
    const fetchTip = () => {
      fetch(urlTips)
        .then((response) => response.json())
        .then((data) => {
          setTip(data.tip);
        });
    };

    fetchTip();

    const intervalId = setInterval(fetchTip, 60000);

    return () => clearInterval(intervalId);
  }, [urlTips]);

  return tip;
};

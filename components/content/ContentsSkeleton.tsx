'use client';

import { Skeleton } from '@nextui-org/skeleton';

export default function ContentsSkeleton() {
  const numberOfContents = 5;

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full">
      {Array.from({ length: numberOfContents }, (_, index) => (
        <Skeleton key={index} className="h-24 w-full mb-6" />
      ))}
    </div>
  );
}

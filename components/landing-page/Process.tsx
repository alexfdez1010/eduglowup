import { cn } from '@/components/utils';
import Link from 'next/link';

import { Iphone15Pro } from '@/components/landing-page/IPhoneMock';
import { PulsatingButton } from '@/components/landing-page/PulsatingButton';
import { Suspense } from 'react';
import { Skeleton } from '@nextui-org/skeleton';

export interface ProcessItem {
  title: string;
  description: string;
  mobileImage: string;
  cta: string;
  reverse?: boolean;
}

export default function Process({
  title,
  description,
  mobileImage,
  cta,
  reverse,
}: ProcessItem) {
  return (
    <div
      className={cn(
        'flex w-full md:flex-row flex-col justify-center md:justify-evenly items-center gap-4',
        reverse && 'md:flex-row-reverse',
      )}
    >
      <div className="h-fit">
        <Suspense
          fallback={<Skeleton className="h-[611px] w-[300px] rounded-3xl" />}
        >
          <Iphone15Pro src={mobileImage} height={611} width={300} />
        </Suspense>
      </div>
      <div className="w-full flex flex-col justify-center items-center md:gap-12 gap-8 md:w-[450px]">
        <h2 className="text-center font-bold text-2xl">{title}</h2>
        <p className="text-pretty text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <PulsatingButton className="max-w-lg">
          <Link href="/sign-up">{cta}</Link>
        </PulsatingButton>
      </div>
    </div>
  );
}

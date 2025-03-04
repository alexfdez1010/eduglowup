'use client';

import { cn } from '@/components/utils';
import { AnimatedList } from '@/components/general/AnimatedList';
import { Trophy } from 'lucide-react';

interface Item {
  name: string;
  description: string;
}

const Notification = ({ name, description }: Item) => {
  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl">
          <Trophy className="size-6 text-primary" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function RewardsExample({
  className,
  localeDictionary,
}: {
  className?: string;
  localeDictionary: Record<string, string>;
}) {
  let notifications = [
    {
      name: localeDictionary['reward'],
      description: localeDictionary['first-reward'],
    },
    {
      name: localeDictionary['reward'],
      description: localeDictionary['second-reward'],
    },
    {
      name: localeDictionary['reward'],
      description: localeDictionary['third-reward'],
    },
    {
      name: localeDictionary['reward'],
      description: localeDictionary['fourth-reward'],
    },
  ];

  notifications = Array.from({ length: 10 }, () => notifications).flat();

  return (
    <div
      className={cn(
        'relative flex h-52 w-full flex-col p-6 overflow-hidden rounded-lg bg-background md:shadow-xl',
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}

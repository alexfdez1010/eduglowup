'use client';

import React, { forwardRef, useRef } from 'react';

import { cn } from '@/components/utils';
import { AnimatedBeam } from '@/components/landing-page/AnimatedBeam';
import {
  BookMarked,
  BookOpenCheck,
  ChartNoAxesCombined,
  File,
  NotebookPen,
  Presentation,
} from 'lucide-react';
import EduGlowUpIcon from '@/components/headers/Logo';

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full bg-foreground p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = 'Circle';

export function AnimatedBeamExercises({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'relative flex items-start size-96 justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl z-0',
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full flex-col max-w-lg max-h-[200px] items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <Icons.document />
          </Circle>
          <Circle ref={div5Ref}>
            <Icons.exam />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <Icons.book />
          </Circle>
          <Circle ref={div4Ref}>
            <Icons.eduglowup />
          </Circle>
          <Circle ref={div6Ref}>
            <Icons.notes />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <Icons.presentation />
          </Circle>
          <Circle ref={div7Ref}>
            <Icons.statistics />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={0}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={0}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div5Ref}
        curvature={75}
        endYOffset={0}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div7Ref}
        curvature={-75}
        endYOffset={0}
      />
    </div>
  );
}

const Icons = {
  document: () => <File className="text-primary" />,
  eduglowup: () => <EduGlowUpIcon className="size-20" />,
  book: () => <BookMarked className="text-primary" />,
  presentation: () => <Presentation className="text-primary" />,
  notes: () => <NotebookPen className="text-primary" />,
  exam: () => <BookOpenCheck className="text-primary" />,
  statistics: () => <ChartNoAxesCombined className="text-primary" />,
};

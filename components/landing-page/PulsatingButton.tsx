'use client';

import React from 'react';

import { cn } from '@/components/utils';

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export function PulsatingButton({
  className,
  children,
  pulseColor = '#0096ff',
  duration = '1.5s',
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        'relative text-center cursor-pointer flex justify-center items-center ' +
          'text-white bg-primary px-4 py-2 rounded-full',
        className,
      )}
      style={
        {
          '--pulse-color': pulseColor,
          '--duration': duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute top-1/2 left-1/2 size-full rounded-full bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2" />
    </button>
  );
}

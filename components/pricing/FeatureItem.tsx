import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface FeatureItemProps {
  children: React.ReactNode;
}

export default function FeatureItem({ children }: FeatureItemProps) {
  return (
    <li className="flex items-center">
      <CheckIcon className="h-5 w-5 text-primary mr-2" />
      <span>{children}</span>
    </li>
  );
}

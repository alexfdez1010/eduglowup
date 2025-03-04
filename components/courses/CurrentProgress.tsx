import { useDictionary } from '@/components/hooks';
import { Tooltip } from '@nextui-org/tooltip';
import CircularPercentage from '@/components/general/CircularPercentage';
import React from 'react';
import { contentService } from '@/lib/services/content-service';

interface CurrentProgressProps {
  courseId: string;
  localeDictionary: Record<string, string>;
}


export default async function CurrentProgress({ courseId, localeDictionary } : CurrentProgressProps) {

  const contents = await contentService.getContentsOfCourse(courseId);

  const totalSum =  (contents.reduce((sum, content) => sum + content.progress, 0)) / contents.length;

  return (
    <Tooltip content={localeDictionary['statistics']} color="primary" showArrow>
      <CircularPercentage value={totalSum} size="lg" />
    </Tooltip>
  );
}


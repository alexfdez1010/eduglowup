'use client';

import { DocumentDto } from '@/lib/dto/document.dto';
import { ContentType } from '@/lib/dto/document.dto';
import VideoContent from '@/components/content/VideoContent';
import FileContent from '@/components/content/FileContent';
import { Button } from '@nextui-org/react';
import NextLink from 'next/link';
import { useDictionary } from '@/components/hooks';
import { ExerciseSelection } from '@/components/content/ExerciseSelection';
import { StartSessionContentButton } from '@/components/content/StartSessionContentButton';
import Title from '@/components/general/Title';

interface ContentShowProps {
  temporalUrl: string;
  content: DocumentDto;
  exercisesNames: string[];
  courseId?: string;
}

export default function ContentShow({
  temporalUrl,
  content,
  exercisesNames,
  courseId,
}: ContentShowProps) {
  const dictionary = useDictionary('content');

  const urlSummaries = courseId
    ? `/app/courses/${courseId}/content/${content.id}/summaries/1`
    : `/app/content/${content.id}/summaries/1`;

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-2xl gap-16">
      <Title title={content.filename} className='w-full' />
      <RenderContent content={content} temporalUrl={temporalUrl} />
      <div className="flex flex-row flex-wrap gap-3 justify-evenly items-center w-full mb-8">
        <Button
          as={NextLink}
          href={urlSummaries}
          color="primary"
        >
          {dictionary['go-to-summaries']}
        </Button>
        <ExerciseSelection exercisesNames={exercisesNames} />
        <StartSessionContentButton document={content} />
      </div>
    </div>
  );
}

const RenderContent = ({
  temporalUrl,
  content,
}: {
  temporalUrl: string;
  content: DocumentDto;
}) => {
  if (content.type === ContentType.VIDEO) {
    return <VideoContent url={temporalUrl} />;
  } else if (content.type === ContentType.FILE) {
    return <FileContent url={temporalUrl} filename={content.filename} />;
  } else {
    return null;
  }
};

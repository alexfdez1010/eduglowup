'use client';

import { ContentType, DocumentCompleteDto } from '@/lib/dto/document.dto';
import NextLink from 'next/link';
import { Chip, Link } from '@nextui-org/react';
import React from 'react';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import { useDictionary, useIsMobile } from '@/components/hooks';
import CircularPercentage from '@/components/general/CircularPercentage';
import { Edit, FileText, File, Link2, Video, Music } from 'lucide-react';
import { useLaunchModal } from '@/components/modal/use-launch-modal';
import EditContent from '@/components/content/EditContent';

interface ContentProps {
  content: DocumentCompleteDto;
  courseId?: string;
}

export default function Content({ content, courseId }: ContentProps) {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-row justify-start items-center sm:gap-3 gap-1">
        <ContentName content={content} courseId={courseId} />
        <ContentTypeComponent content={content} />
      </div>
      <div className="flex flex-row justify-end items-center sm:gap-3 gap-1">
        {content.isOwner && <ContentEdit content={content} />}
        <ContentStatistics content={content} />
      </div>
    </div>
  );
}

export function ContentName({ content, courseId }: ContentProps) {
  const formatName =
    content.filename.length <= 30
      ? content.filename
      : content.filename.replace(/(.{40}).+/, '$1...');

  const isMobile = useIsMobile();

  const url = courseId
    ? `/app/courses/${courseId}/content/${content.id}`
    : `/app/content/${content.id}`;

  return (
    <Link
      as={NextLink}
      href={url}
      color="primary"
      showAnchorIcon={!isMobile}
      size="sm"
      className="max-w-36 sm:max-w-96"
      data-cy="explore-content-link"
    >
      <p className="break-all">{formatName}</p>
    </Link>
  );
}

export function ContentStatistics({ content }: ContentProps) {
  const dictionary = useDictionary('statistics');

  return (
    <Tooltip content={dictionary['statistics']} color="primary" showArrow>
      <Link href={`/app/statistics/content/${content.id}`} color="foreground">
        <CircularPercentage value={content.progress} size="lg" />
      </Link>
    </Tooltip>
  );
}

function ContentEdit({ content }: ContentProps) {
  const dictionary = useDictionary('content');

  const launchModal = useLaunchModal();

  return (
    <>
      <Tooltip content={dictionary['edit-document']} color="primary" showArrow>
        <Button
          onPress={() => launchModal(`edit-document-${content.id}`)}
          variant="ghost"
          color="primary"
          isIconOnly
          radius="full"
          className="flex flex-row justify-center items-center"
          aria-label={`${dictionary['edit-document']} ${content.filename}`}
        >
          <Edit className="size-5 self-center" />
        </Button>
      </Tooltip>
      <EditContent content={content} />
    </>
  );
}

function ContentSummary({ content }: ContentProps) {
  const dictionary = useDictionary('content');

  return (
    <Tooltip content={dictionary['summaries']} color="primary" showArrow>
      <Button
        as={NextLink}
        href={`/app/content/${content.id}/summaries/1`}
        isIconOnly
        color="primary"
        radius="full"
        className="flex flex-row justify-center items-center"
        aria-label={`${dictionary['summaries']} ${content.filename}`}
      >
        <FileText className="size-5 self-center" />
      </Button>
    </Tooltip>
  );
}

const typeConfig: Record<ContentType, { color: string; icon: React.ElementType }> = {
  [ContentType.TEXT]: { color: 'primary', icon: FileText },
  [ContentType.URL]: { color: 'warning', icon: Link2 },
  [ContentType.VIDEO]: { color: 'success', icon: Video },
  [ContentType.AUDIO]: { color: 'warning', icon: Music },
  [ContentType.FILE]: { color: 'danger', icon: File },
};

export function ContentTypeComponent({ content }: ContentProps) {
  const isMobile = useIsMobile();
  const { color, icon: Icon } = typeConfig[content.type];

  return (
    <div className={`flex items-center justify-center rounded-full p-1.5 bg-${color}/20`}>
      <Icon className={`text-${color} ${isMobile ? 'size-4' : 'size-5'}`} />
    </div>
  );
}

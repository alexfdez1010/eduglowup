'use client';

import { Button } from '@nextui-org/button';
import React, { Key } from 'react';
import { useDictionary } from '@/components/hooks';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import UploadDocument from '@/components/content/UploadDocument';
import UploadVideo from '@/components/content/UploadVideo';
import UploadAudio from '@/components/content/UploadAudio';
import GenerateNotes from '@/components/content/GenerateContent';
import ReuseContent from '@/components/content/ReuseContent';
import ModalWrapper from '@/components/modal/ModalWrapper';
import { useLaunchModal } from '@/components/modal/use-launch-modal';

interface UploadContentProps {
  showReuseContent: boolean;
}

export default function UploadContent({
  showReuseContent = true,
}: UploadContentProps) {
  const dictionary = useDictionary('content');

  const launchModal = useLaunchModal();

  const items = [
    {
      key: 'upload-document',
      label: dictionary['upload-document'],
      description: dictionary['upload-document-description'],
      content: <UploadDocument />,
    },
    {
      key: 'upload-video',
      label: dictionary['upload-video'],
      description: dictionary['upload-video-description'],
      content: <UploadVideo />,
    },
    {
      key: 'generate-content',
      label: dictionary['generate-notes'],
      description: dictionary['generate-notes-description'],
      content: <GenerateNotes />,
    },
    {
      key: 'upload-audio',
      label: dictionary['upload-audio'],
      description: dictionary['upload-audio-description'],
      content: <UploadAudio />,
    }
  ];

  if (showReuseContent) {
    items.push({
      key: 'reuse-content',
      label: dictionary['reuse-content'],
      description: dictionary['reuse-content-description'],
      content: <ReuseContent />,
    });
  }

  const handleSelection = (selection: Key) => {
    items.forEach((item) => {
      if (item.key === selection) {
        launchModal(item.key);
      }
    });
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button color="primary" variant="solid" data-cy="upload-content">
            {dictionary['upload-notes']}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Upload content options"
          onAction={handleSelection}
          className="w-[340px]"
        >
          {items.map((item) => (
            <DropdownItem
              key={item.key}
              description={item.description}
              className="gap-2"
              data-cy={item.key}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {items.map((item) => (
        <ModalWrapper
          key={item.key}
          keyModal={item.key}
          title={item.label}
          content={item.content}
        />
      ))}
    </>
  );
}

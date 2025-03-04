'use client';

import { Download } from 'lucide-react';
import React from 'react';
import { useDictionary } from '../hooks';
import { Button } from '@nextui-org/react';

interface FileContentProps {
  url: string;
  filename: string;
}

export default function FileContent({ url, filename }: FileContentProps) {
  const dictionary = useDictionary('content');

  return (
    <Button as="a" href={url} download={filename} color="primary" size="lg">
      <Download className="size-5 mr-2" />
      {dictionary['download']}
    </Button>
  );
}

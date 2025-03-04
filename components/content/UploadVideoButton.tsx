'use client';

import { Button } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';
import React, { useEffect } from 'react';
import { successToast } from '../ToastContainerWrapper';
import { useDictionary } from '@/components/hooks';

export default function UploadVideoButton() {
  const { pending } = useFormStatus();
  const dictionary = useDictionary('content');

  useEffect(() => {
    if (pending) {
      pending && successToast(dictionary['uploading-video']);
      setTimeout(
        () => pending && successToast(dictionary['transcribing-video']),
        3000,
      );
      setTimeout(
        () => pending && successToast(dictionary['analyzing-video']),
        5000,
      );
    }
  }, [pending, dictionary]);

  return (
    <Button
      type="submit"
      color="primary"
      variant="solid"
      isLoading={pending}
      data-cy="upload-video-button"
      className="w-full"
    >
      {dictionary['upload-video']}
    </Button>
  );
}

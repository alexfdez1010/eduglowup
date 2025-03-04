'use client'

import { useFormStatus } from 'react-dom';
import { useDictionary } from '@/components/hooks';
import React, { useEffect } from 'react';
import { successToast } from '@/components/ToastContainerWrapper';
import { Button } from '@nextui-org/react';


export default function UploadAudioButton(){
  const { pending } = useFormStatus();
  const dictionary = useDictionary('content');


  useEffect(() => {
    if (pending) {
      pending && successToast(dictionary['uploading-audio']);
      setTimeout(
        () => pending && successToast(dictionary['transcribing-audio']),
        3000,
      );
      setTimeout(
        () => pending && successToast(dictionary['analyzing-audio']),
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
      data-cy="upload-audio-button"
      className="w-full"
    >
      {dictionary['upload-audio']}
    </Button>
  );

}
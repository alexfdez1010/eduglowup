import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/button';
import React, { useEffect } from 'react';
import { successToast } from '../ToastContainerWrapper';
import { useDictionary } from '@/components/hooks';

export default function UploadDocumentButton() {
  const { pending } = useFormStatus();

  const dictionary = useDictionary('content');

  useEffect(() => {
    if (pending) {
      pending && successToast(dictionary['uploading-document']);
      setTimeout(
        () => pending && successToast(dictionary['dividing-document']),
        3000,
      );
      setTimeout(
        () => pending && successToast(dictionary['analyzing-document']),
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
      data-cy="upload-document-button"
    >
      {dictionary['upload']}
    </Button>
  );
}

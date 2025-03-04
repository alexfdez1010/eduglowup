import { useFormStatus } from 'react-dom';
import { useDictionary } from '@/components/hooks';
import React, { useEffect } from 'react';
import { successToast } from '@/components/ToastContainerWrapper';
import { Button } from '@nextui-org/button';

export default function GenerateNotesButton() {
  const { pending } = useFormStatus();

  const dictionary = useDictionary('content');

  useEffect(() => {
    if (pending) {
      pending && successToast(dictionary['start-generating-notes']);
      setTimeout(
        () => pending && successToast(dictionary['generating-summaries']),
        2000,
      );
    }
  }, [pending, dictionary]);

  return (
    <Button type="submit" color="primary" variant="solid" isLoading={pending}>
      {dictionary['generate-notes']}
    </Button>
  );
}

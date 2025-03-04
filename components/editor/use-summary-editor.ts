import { useState } from 'react';
import { errorToast, successToast } from '@/components/ToastContainerWrapper';

export const useSummaryEditor = (
  initialMarkdown: string,
  contentId: string,
  order: number,
  successMessage: string,
  errorMessage: string,
) => {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  const url = `/api/summary/${contentId}/${order}`;

  const save = () => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ summary: markdown }),
    }).then((response) => {
      if (response.ok) {
        successToast(successMessage);
      } else {
        errorToast(errorMessage);
      }
    });
  };

  return {
    markdown,
    setMarkdown,
    save,
  };
};

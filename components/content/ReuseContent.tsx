'use client';

import { useDictionary } from '@/components/hooks';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { reuseContent } from '@/lib/actions/content';
import { RadioGroup, Radio, Button, Spinner } from '@nextui-org/react';
import HiddenInputCourseId from '@/components/content/HiddenInputCourseId';
import { useState, useEffect } from 'react';
import { DocumentCompleteDto } from '@/lib/dto/document.dto';
import {
  ContentName,
  ContentTypeComponent,
} from '@/components/content/Content';

export default function ReuseContent() {
  const dictionary = useDictionary('content');
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [contents, setContents] = useState<DocumentCompleteDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch('/api/contents');
        if (!response.ok) {
          throw new Error('Failed to fetch contents');
        }
        const data = await response.json();
        setContents(data);
      } catch (error) {
        console.error('Error fetching contents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center p-4">
        <p>{dictionary['no-contents']}</p>
      </div>
    );
  }

  return (
    <FormWithFeedbackManagement
      className="flex flex-col justify-center items-center gap-5 w-full"
      action={reuseContent}
      errorAsToast
    >
      <RadioGroup
        label={dictionary['select-content']}
        value={selectedContent}
        onValueChange={setSelectedContent}
        className="w-full flex flex-col justify-center items-center"
      >
        {contents.map((content) => (
          <Radio
            key={content.id}
            value={content.id}
          >
            <div className="flex flex-row justify-between items-center">
              <ContentName content={content} />
              <ContentTypeComponent content={content} />
            </div>
          </Radio>
        ))}
      </RadioGroup>
      <input type="hidden" name="contentId" value={selectedContent} />
      <HiddenInputCourseId />
      <Button
        type="submit"
        color="primary"
        isDisabled={!selectedContent}
        className="max-w-96"
      >
        {dictionary['reuse']}
      </Button>
    </FormWithFeedbackManagement>
  );
}

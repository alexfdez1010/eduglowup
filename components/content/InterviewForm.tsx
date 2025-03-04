'use client';

import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDictionary } from '@/components/hooks';

interface InterviewFormProps {
  questions: string[];
  courseId: string;
  topic: string;
}

export function InterviewForm({
  questions,
  courseId,
  topic,
}: InterviewFormProps) {
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ''));
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dictionary = useDictionary('content');

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('topic', topic);

      const qa = questions
        .map((question, index) => ({
          question,
          answer: answers[index],
        }))
        .filter((item) => item.answer.trim() !== '');

      formData.append('qa', JSON.stringify(qa));

      const response = await fetch('/api/interview', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit interview');
      }

      router.push(`/app/courses/${courseId}`);
    } catch (error) {
      console.error('Error submitting interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 mb-12">
      <p className="text-lg text-gray-600 dark:text-gray-400">
        {dictionary['interview-description']}
      </p>
      {questions.map((question, index) => (
        <div key={index} className="flex flex-col gap-2">
          <p className="text-lg font-medium">{question}</p>
          <Textarea
            placeholder={dictionary['answer-placeholder']}
            value={answers[index]}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[index] = e.target.value;
              setAnswers(newAnswers);
            }}
            minRows={3}
          />
        </div>
      ))}
      <Button
        color="primary"
        onPress={handleSubmit}
        isLoading={isLoading}
        isDisabled={answers.every((answer) => answer.trim() === '')}
      >
        {dictionary['finish-interview']}
      </Button>
    </div>
  );
}

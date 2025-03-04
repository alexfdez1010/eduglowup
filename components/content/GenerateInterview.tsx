'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useDictionary } from '@/components/hooks';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function GenerateInterview() {
  const router = useRouter();
  const params = useParams();
  const [topic, setTopic] = useState('');

  const dictionary = useDictionary('content');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    const courseId = params.id as string;
    router.push(
      `/${params.locale}/app/courses/${courseId}/interview?topic=${encodeURIComponent(topic)}`,
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 w-full my-4 justify-center items-center"
    >
      <Input
        type="text"
        value={topic}
        onValueChange={setTopic}
        label={dictionary['topic']}
        placeholder={dictionary['topic-description']}
        color="primary"
        variant="bordered"
        className="max-w-96"
      />
      <Button type="submit" color="primary" isDisabled={!topic}>
        {dictionary['start-interview']}
      </Button>
    </form>
  );
}

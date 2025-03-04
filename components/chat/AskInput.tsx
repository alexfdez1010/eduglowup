import { Textarea } from '@nextui-org/input';
import React, { useState } from 'react';
import { Button } from '@nextui-org/button';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { useDictionary } from '@/components/hooks';
import AskTypicalQuestions from '@/components/chat/AskTypicalQuestions';

interface AskInputProps {
  typicalQuestions: string[];
  ask: (message: string) => Promise<void>;
}

export default function AskInput({ typicalQuestions, ask }: AskInputProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dictionary = useDictionary('sessions');

  const handleAsk = async () => {
    if (text.length === 0) {
      return;
    }

    setIsLoading(true);
    setText('');

    ask(text).finally(() => setIsLoading(false));
  };

  return (
    <form className="w-full flex flex-col gap-5 justify-center items-center">
      <AskTypicalQuestions
        typicalQuestions={typicalQuestions}
        setText={setText}
      />
      <Textarea
        variant="faded"
        color="primary"
        name="text"
        minRows={1}
        maxRows={5}
        value={text}
        onValueChange={(value) => setText(value)}
        className="text-foreground"
        type="text"
        placeholder={dictionary['ask-description']}
        onKeyDown={async (event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter' && !isLoading) {
            event.preventDefault();
            await handleAsk();
          }
        }}
        endContent={
          <Button
            isIconOnly
            color="primary"
            variant="solid"
            radius="full"
            size="sm"
            isDisabled={text.length === 0}
            isLoading={isLoading}
            onPress={handleAsk}
          >
            <ArrowUpIcon className="size-4 stroke-2" />
          </Button>
        }
      />
    </form>
  );
}

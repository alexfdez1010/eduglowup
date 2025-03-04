import { MessageDto } from '@/lib/dto/message.dto';
import AskMessages from '@/components/chat/AskMessages';
import AskInput from '@/components/chat/AskInput';
import { useEffect, useRef } from 'react';

interface AskProps {
  typicalQuestions: string[];
  messages: MessageDto[];
  ask: (message: string) => Promise<void>;
}

export default function Ask({ typicalQuestions, messages, ask }: AskProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full gap-3 h-full overflow-y-auto">
      <AskMessages messages={messages} />
      <div ref={scrollRef} />
      <AskInput ask={ask} typicalQuestions={typicalQuestions} />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { MessageDto, MessageType } from '@/lib/dto/message.dto';

const useChatInternal = (
  url: string,
): {
  messages: MessageDto[];
  ask: (message: string) => Promise<void>;
} => {
  const [messages, setMessages] = useState<MessageDto[]>([]);

  useEffect(() => {
    const response = fetch(url);
    response
      .then((response) => response.json())
      .then((data) => {
        setMessages(data.messages);
      });
  }, [url]);

  const addMessage = (message: MessageDto) => {
    setMessages((prevState) => {
      return [...prevState, message];
    });
  };

  const ask = async (message: string) => {
    addMessage({
      type: MessageType.USER,
      message: message,
      order: (messages[messages.length - 1]?.order || 0) + 1,
    });

    const formData = new FormData();
    formData.append('message', message);

    await fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => addMessage(data.message));
  };

  return { messages, ask };
};

export const useChat = (isInPart: boolean, id: string) => {
  const url = `/api/chat/${isInPart ? 'part' : 'session'}/${id}`;
  return useChatInternal(url);
};

export const useTypicalQuestions = (documentId: string, partOrder: number) => {
  const url = `/api/chat/typical-questions/${documentId}/${partOrder}`;

  const [questions, setQuestions] = useState<string[]>([]);

  const reloadQuestions = () => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.questions);
      });
  };

  useEffect(() => {
    reloadQuestions();

    const interval = setInterval(() => {
      reloadQuestions();
    }, 60000);

    return () => clearInterval(interval);
  }, [url]);

  return questions;
};

import MarkdownComplete from '@/components/general/MarkdownComplete';

interface MessageChatProps {
  message: string;
}

export function MessageChatUser({ message }: MessageChatProps) {
  return (
    <p className="bg-primary text-white rounded-l-lg rounded-br-lg self-end p-5 shadow-md mt-4 flex flex-col gap-3 border md:w-96 w-10/12 border-transparent prose dark:prose-invert">
      {message}
    </p>
  );
}

export function MessageChatAI({ message }: MessageChatProps) {
  return (
    <MarkdownComplete text={message} className="prose dark:prose-invert" />
  );
}

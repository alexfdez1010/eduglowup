import { MessageDto, MessageType } from '@/lib/dto/message.dto';
import { MessageChatAI, MessageChatUser } from '@/components/chat/MessageChat';

interface AskMessagesProps {
  messages: MessageDto[];
}

export default function AskMessages({ messages }: AskMessagesProps) {
  return (
    <>
      {messages.map((message) => (
        <Message key={message.order} message={message} />
      ))}
    </>
  );
}

function Message({ message }: { message: MessageDto }) {
  switch (message.type) {
    case MessageType.USER:
      return <MessageChatUser message={message.message} />;
    case MessageType.AI:
      return <MessageChatAI message={message.message} />;
    default:
      return null;
  }
}

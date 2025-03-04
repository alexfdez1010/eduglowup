import { MessageCircleMore } from 'lucide-react';
import { useDictionary } from '@/components/hooks';
import { Button } from '@nextui-org/react';
import { useChat, useTypicalQuestions } from '@/components/chat/hooks';
import Ask from '@/components/chat/Ask';
import ModalWrapper from '@/components/modal/ModalWrapper';
import { useLaunchModal } from '@/components/modal/use-launch-modal';

interface AskProps {
  isInPart: boolean;
  idForChat: string;
  documentId: string;
  order: number;
}

export default function AskButton({
  isInPart,
  idForChat,
  documentId,
  order,
}: AskProps) {
  const { messages, ask } = useChat(isInPart, idForChat);
  const questions = useTypicalQuestions(documentId, order);

  const dictionary = useDictionary('sessions');

  const launchModal = useLaunchModal();

  return (
    <>
      <Button
        color="primary"
        variant="solid"
        isIconOnly
        radius="full"
        onPress={() => launchModal('ask')}
        data-cy={'ask-button'}
      >
        <MessageCircleMore className="size-6" />
      </Button>
      <ModalWrapper
        keyModal="ask"
        title={dictionary['ask-title']}
        notScrollToTop
        content={
          <Ask typicalQuestions={questions} messages={messages} ask={ask} />
        }
      />
    </>
  );
}

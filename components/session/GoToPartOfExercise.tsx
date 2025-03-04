import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Button, Tooltip, Link, useDisclosure } from '@nextui-org/react';
import { useDictionary } from '@/components/hooks';
import SessionSummary from '@/components/session/SessionSummary';
import { Modal, ModalBody, ModalContent } from '@nextui-org/modal';
import ModalWrapper from '@/components/modal/ModalWrapper';
import { useLaunchModal } from '@/components/modal/use-launch-modal';

interface GoToPartOfExerciseProps {
  documentId: string;
  partOrder: number;
  questionId: string;
}

export default function GoToPartOfExercise({
  documentId,
  partOrder,
  questionId,
}: GoToPartOfExerciseProps) {
  const dictionary = useDictionary('sessions');

  const launchModal = useLaunchModal();

  return (
    <>
      <Tooltip
        content={dictionary['go-to-summary']}
        color="primary"
        showArrow
        placement="left"
      >
        <Button
          onPress={() => launchModal(`summary-${questionId}`)}
          color="primary"
          variant="ghost"
          isIconOnly
          radius="full"
          aria-label={dictionary['go-to-summary']}
        >
          <DocumentTextIcon className="size-6" />
        </Button>
      </Tooltip>
      <ModalWrapper
        keyModal={`summary-${questionId}`}
        title={dictionary['summary']}
        content={
          <SessionSummary documentId={documentId} partOrder={partOrder} />
        }
      />
    </>
  );
}

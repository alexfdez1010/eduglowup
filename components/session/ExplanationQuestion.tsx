import { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Spinner,
  useDisclosure,
  Tooltip,
} from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import { Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { useDictionary } from '@/components/hooks';
import { ModalContent } from '@nextui-org/modal';
import ModalWrapper from '@/components/modal/ModalWrapper';
import MarkdownComplete from '@/components/general/MarkdownComplete';
import { useLaunchModal } from '@/components/modal/use-launch-modal';
import { useTip } from '@/components/general/Tip';

interface ExplanationQuestionProps {
  exercise: string;
  questionId: string;
}

export default function ExplanationQuestionButton({
  exercise,
  questionId,
}: ExplanationQuestionProps) {
  const dictionary = useDictionary('sessions');

  const launchModal = useLaunchModal();

  return (
    <>
      <Tooltip
        content={dictionary['explanation']}
        color="primary"
        showArrow
        placement="left"
      >
        <Button
          color="primary"
          variant="solid"
          isIconOnly
          radius="full"
          onPress={() => launchModal(`explanation-${questionId}`)}
          data-cy={'explain-button'}
        >
          <Sparkles className="size-6" />
        </Button>
      </Tooltip>
      <ModalWrapper
        keyModal={`explanation-${questionId}`}
        title={dictionary['explanation']}
        content={
          <ExplanationQuestion exercise={exercise} questionId={questionId} />
        }
      />
    </>
  );
}

function ExplanationQuestion({
  exercise,
  questionId,
}: ExplanationQuestionProps) {
  const explanation = useExplanationQuestion(exercise, questionId);

  if (!explanation) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <MarkdownComplete text={explanation} />;
}

const useExplanationQuestion = (exercise: string, questionId: string) => {
  const [explanation, setExplanation] = useState<string | null>(null);

  useEffect(() => {
    if (explanation) {
      return;
    }

    fetch(`/api/explanation/${exercise}/${questionId}`)
      .then((response) => response.json())
      .then((data) => {
        setExplanation(data.explanation);
      });
  }, [explanation, exercise, questionId]);

  return explanation;
};

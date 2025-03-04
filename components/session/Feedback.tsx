import { Button } from '@nextui-org/react';
import { useDictionary } from '@/components/hooks';
import { successToast } from '@/components/ToastContainerWrapper';
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { cn } from '@/components/utils';

interface FeedbackProps {
  exercise: string;
  questionId: string;
}

export default function Feedback({ exercise, questionId }: FeedbackProps) {
  const dictionary = useDictionary('sessions');

  const { feedback, handleFeedback } = useFeedback(
    exercise,
    questionId,
    dictionary['feedback-sent'],
  );

  return (
    <div className="flex flex-row justify-center items-center gap-1">
      <Button
        color="success"
        variant={feedback === FeedbackType.POSITIVE ? 'solid' : 'ghost'}
        isIconOnly
        radius="full"
        className={cn(
          FeedbackType.POSITIVE !== feedback && 'border-0 bg-transparent',
        )}
        onPress={() => handleFeedback('true')}
        data-cy="feedback-positive-button"
      >
        <HandThumbUpIcon className="size-5" />
      </Button>
      <Button
        color="danger"
        variant={feedback === FeedbackType.NEGATIVE ? 'solid' : 'ghost'}
        isIconOnly
        radius="full"
        className={cn(
          FeedbackType.NEGATIVE !== feedback && 'border-0 bg-transparent',
        )}
        onPress={() => handleFeedback('false')}
        data-cy="feedback-negative-button"
      >
        <HandThumbDownIcon className="size-5" />
      </Button>
    </div>
  );
}

const enum FeedbackType {
  NONE,
  POSITIVE,
  NEGATIVE,
}

const useFeedback = (exercise: string, questionId: string, message: string) => {
  const [feedback, setFeedback] = useState<FeedbackType>(FeedbackType.NONE);

  const handleFeedback = (isPositive: string) => {
    if (feedback !== FeedbackType.NONE) {
      return;
    }

    const formData = new FormData();
    formData.append('exercise', exercise);
    formData.append('questionId', questionId);
    formData.append('isPositive', isPositive);

    fetch('/api/feedback', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (response.ok) {
        setFeedback(
          isPositive === 'true' ? FeedbackType.POSITIVE : FeedbackType.NEGATIVE,
        );
        successToast(message);
      }
    });
  };

  return { feedback, handleFeedback };
};

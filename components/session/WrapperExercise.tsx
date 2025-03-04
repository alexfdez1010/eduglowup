import Feedback from '@/components/session/Feedback';
import GoToPartOfExercise from '@/components/session/GoToPartOfExercise';
import { ReactNode } from 'react';
import ExplanationQuestion from '@/components/session/ExplanationQuestion';
import AskButton from '@/components/chat/AskButton';
import GoToContent from '../content/GoToContent';

interface WrapperExerciseProps {
  documentId: string;
  partOrder: number;
  children: ReactNode | ReactNode[];
  exercise: string;
  hasFinishedExercise: boolean;
  questionId: string;
}

export default function WrapperExercise({
  children,
  documentId,
  partOrder,
  exercise,
  hasFinishedExercise,
  questionId,
}: WrapperExerciseProps) {
  return (
    <div className="flex flex-col px-6 h-fit w-full z-0 gap-5">
      <div className="flex flex-row gap-5 justify-end items-center">
        {questionId && <Feedback exercise={exercise} questionId={questionId} />}
        <div className="flex flex-row gap-2">
          {documentId && partOrder && (
            <>
              <GoToPartOfExercise
                documentId={documentId}
                partOrder={partOrder}
                questionId={questionId}
              />
              <GoToContent contentId={documentId} useTooltip />
            </>
          )}
          {hasFinishedExercise && (
            <ExplanationQuestion exercise={exercise} questionId={questionId} />
          )}
        </div>
      </div>
      <div className="flex flex-col justify-start items-start w-full h-fit gap-4">
        {children}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import {
  ShortQuestionDto,
  ShortQuestionsDto,
} from '@/lib/dto/short-questions.dto';
import { Textarea } from '@nextui-org/input';
import { BlockDto } from '@/lib/dto/block.dto';
import { ExerciseBottom } from '@/components/session/ExerciseBottom';
import WrapperExercise from './WrapperExercise';
import { useDictionary } from '@/components/hooks';
import { useSubmit } from '@/components/session/hooks';
import { cn } from '@/components/utils';

interface ShortQuestionsProps {
  shortQuestions: ShortQuestionsDto;
  sessionId: string;
  isActive: boolean;
  finishExam: (block: BlockDto) => void;
  hasFinishedExercise: boolean;
}

export default function ShortQuestions({
  shortQuestions,
  sessionId,
  isActive,
  finishExam,
  hasFinishedExercise,
}: ShortQuestionsProps) {
  const minWords = 30;
  const maxWords = 60;

  const [shortQuestionsState, setShortQuestionsState] =
    useState<ShortQuestionsDto>(shortQuestions);

  useEffect(() => {
    setShortQuestionsState(shortQuestions);
  }, [shortQuestions]);

  const { loading, handleSubmit } = useSubmit(
    '/api/answer/short-questions',
    finishExam,
  );

  function wordsWritten(text: string) {
    if (text === '') return 0;
    const words = text.split(/ +/);
    return words.length - (words[words.length - 1] === '' ? 1 : 0);
  }

  const dictionary = useDictionary('short-questions');

  const documentId = shortQuestions.documentId;
  const partOrder = shortQuestions.partOrder;

  const isAnswered = (question: ShortQuestionDto) => {
    return (
      minWords <= wordsWritten(question.answer) &&
      wordsWritten(question.answer) <= maxWords
    );
  };

  const allAnswered = () => {
    return shortQuestionsState.questions.every((question) =>
      isAnswered(question),
    );
  };

  const getColor = (index: number) => {
    if (!isAnswered(shortQuestionsState.questions[index])) {
      return 'default';
    }

    if (!shortQuestionsState.questions[index].rubric) {
      return 'primary';
    }

    if (shortQuestionsState.questions[index].isCorrect) {
      return 'success';
    }

    return 'danger';
  };

  return (
    <>
      {shortQuestionsState.questions.map((question, index) => (
        <WrapperExercise
          questionId={question.id}
          documentId={documentId}
          partOrder={partOrder}
          exercise="short-questions"
          key={index}
          hasFinishedExercise={hasFinishedExercise}
        >
          <p className="text-sm font-bold">
            {dictionary['description']
              .replace('{minWords}', minWords.toString())
              .replace('{maxWords}', maxWords.toString())}
          </p>
          <Textarea
            variant="faded"
            color={getColor(index)}
            minRows={5}
            label={`${index + 1}. ${question.question}`}
            value={question.answer}
            isReadOnly={!isActive}
            onValueChange={(value) => {
              const newShortQuestionsState = { ...shortQuestionsState };
              newShortQuestionsState.questions[index].answer = value;
              setShortQuestionsState(newShortQuestionsState);
            }}
            data-cy={`short-question-answer-${index}`}
          />
          <p
            className={cn(
              'text-sm text-center w-full',
              isAnswered(question) ? 'text-success' : 'text-danger',
            )}
          >
            {`${dictionary['written-words']}: ${wordsWritten(question.answer)}`}
          </p>
        </WrapperExercise>
      ))}
      <ExerciseBottom
        canSubmit={allAnswered() && isActive}
        loading={loading}
        submit={async () => {
          const formData = new FormData();
          formData.append('sessionId', sessionId);
          formData.append('answer', JSON.stringify(shortQuestionsState));
          await handleSubmit(formData);
        }}
        descriptionSubmit={dictionary['submit']}
      />
    </>
  );
}

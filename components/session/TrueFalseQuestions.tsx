import React, { useEffect, useState } from 'react';

import { TrueFalseQuestionsDto } from '@/lib/dto/true-false.dto';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { BlockDto } from '@/lib/dto/block.dto';
import { useSubmit } from '@/components/session/hooks';
import { ExerciseBottom } from '@/components/session/ExerciseBottom';
import WrapperExercise from './WrapperExercise';
import { useDictionary } from '@/components/hooks';

interface TrueFalseQuestionsProps {
  trueFalseQuestions: TrueFalseQuestionsDto;
  sessionId: string;
  isActive: boolean;
  finishExam: (block: BlockDto) => void;
  hasFinishedExercise: boolean;
}

export default function TrueFalseQuestions({
  trueFalseQuestions,
  sessionId,
  isActive,
  finishExam,
  hasFinishedExercise,
}: TrueFalseQuestionsProps) {
  const [trueFalseQuestionsState, setTrueFalseQuestionsState] =
    useState<TrueFalseQuestionsDto>(trueFalseQuestions);

  useEffect(() => {
    setTrueFalseQuestionsState(trueFalseQuestions);
  }, [trueFalseQuestions]);

  const { loading, handleSubmit } = useSubmit(
    '/api/answer/true-false',
    finishExam,
  );

  const documentId = trueFalseQuestions.documentId;
  const partOrder = trueFalseQuestions.partOrder;

  const dictionary = useDictionary('true-false');

  const trueText = dictionary['true'];
  const falseText = dictionary['false'];

  const getColor = (index: number) => {
    if (trueFalseQuestionsState.questions[index].answer === 'no-answered') {
      return 'default';
    }

    if (trueFalseQuestionsState.questions[index].isTrue === undefined) {
      return 'primary';
    }

    if (
      trueFalseQuestionsState.questions[index].isTrue ===
      (trueFalseQuestionsState.questions[index].answer === 'true')
    ) {
      return 'success';
    }

    return 'danger';
  };

  const allAnswered = () => {
    return trueFalseQuestionsState.questions.every(
      (question) => question.answer !== 'no-answered',
    );
  };

  return (
    <>
      {trueFalseQuestionsState.questions.map((question, index) => (
        <WrapperExercise
          questionId={question.id}
          documentId={documentId}
          partOrder={partOrder}
          exercise="true-false"
          key={index}
          hasFinishedExercise={hasFinishedExercise}
        >
          <RadioGroup
            className="flex flex-col gap-5"
            color={getColor(index)}
            label={`${index + 1}. ${question.question}`}
            value={question.answer}
            isReadOnly={!isActive}
            onValueChange={(value) => {
              const newTrueFalseQuestionsState = { ...trueFalseQuestionsState };
              newTrueFalseQuestionsState.questions[index].answer = value as
                | 'true'
                | 'false';
              setTrueFalseQuestionsState(newTrueFalseQuestionsState);
            }}
          >
            <Radio value="true" data-cy={`true-selector-${index}`}>
              {trueText}
            </Radio>
            <Radio value="false" data-cy={`false-selector-${index}`}>
              {falseText}
            </Radio>
          </RadioGroup>
        </WrapperExercise>
      ))}
      <ExerciseBottom
        canSubmit={allAnswered() && isActive}
        loading={loading}
        submit={async () => {
          const formData = new FormData();
          formData.append('sessionId', sessionId);
          formData.append('answer', JSON.stringify(trueFalseQuestionsState));
          await handleSubmit(formData);
        }}
        descriptionSubmit={dictionary['submit']}
      />
    </>
  );
}

import { QuizDto } from '@/lib/dto/quiz.dto';
import React, { useEffect, useState } from 'react';

import { Radio, RadioGroup } from '@nextui-org/radio';
import { BlockDto } from '@/lib/dto/block.dto';
import { useSubmit } from '@/components/session/hooks';
import { ExerciseBottom } from '@/components/session/ExerciseBottom';
import WrapperExercise from './WrapperExercise';
import { useDictionary } from '@/components/hooks';

interface QuizProps {
  quiz: QuizDto;
  sessionId: string;
  isActive: boolean;
  finishExam: (block: BlockDto) => void;
  hasFinishedExercise: boolean;
}

export default function Quiz({
  quiz,
  sessionId,
  isActive,
  finishExam,
  hasFinishedExercise,
}: QuizProps) {
  const [quizState, setQuizState] = useState<QuizDto>(quiz);

  useEffect(() => {
    setQuizState(quiz);
  }, [quiz]);

  const { loading, handleSubmit } = useSubmit('/api/answer/quiz', finishExam);

  const dictionary = useDictionary('quiz');

  const documentId = quizState.documentId;
  const partOrder = quizState.partOrder;

  const allAnswered = () => {
    return quizState.questions.every((question) => question.answer !== -1);
  };

  const getColor = (index: number) => {
    if (quizState.questions[index].answer === -1) {
      return 'default';
    }

    if (quizState.questions[index].correctAnswer === undefined) {
      return 'primary';
    }

    if (
      quizState.questions[index].correctAnswer ===
      quizState.questions[index].answer
    ) {
      return 'success';
    }

    return 'danger';
  };

  return (
    <>
      {quizState.questions.map((question, index) => (
        <WrapperExercise
          questionId={question.id}
          documentId={documentId}
          partOrder={partOrder}
          exercise="quiz"
          key={index}
          hasFinishedExercise={hasFinishedExercise}
        >
          <RadioGroup
            className="flex flex-col gap-3"
            color={getColor(index)}
            isReadOnly={!isActive}
            label={`${index + 1}. ${question.question}`}
            value={question.answer.toString()}
            onValueChange={(value) => {
              const newQuizState = { ...quizState };
              newQuizState.questions[index].answer = parseInt(value);
              setQuizState(newQuizState);
            }}
          >
            {question.answers.map((answer, indexAnswer) => (
              <Radio
                key={indexAnswer}
                value={indexAnswer.toString()}
                data-cy={`quiz-answer-${index}-${indexAnswer}`}
              >
                {answer}
              </Radio>
            ))}
          </RadioGroup>
        </WrapperExercise>
      ))}
      <ExerciseBottom
        canSubmit={allAnswered() && isActive}
        loading={loading}
        submit={async () => {
          const formData = new FormData();
          formData.append('sessionId', sessionId);
          formData.append('answer', JSON.stringify(quizState));
          await handleSubmit(formData);
        }}
        descriptionSubmit={dictionary['submit']}
      />
    </>
  );
}

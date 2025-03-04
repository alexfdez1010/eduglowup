'use client';

import React, { useState } from 'react';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { Button } from '@nextui-org/button';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface QuizScienceProps {
  questions: { question: string; answers: string[]; correctAnswer: number }[];
}

export default function QuizScience({ questions }: QuizScienceProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    Array(questions.length).fill(-1),
  );
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col gap-5 justify-center items-start w-full">
      <RadioGroup
        className="flex flex-col"
        label={`${index + 1}. ${questions[index].question}`}
        value={selectedAnswers[index].toString()}
        onValueChange={(value) => {
          setSelectedAnswers((prevState) => {
            const newSelectedAnswers = [...prevState];
            newSelectedAnswers[index] = parseInt(value);
            return newSelectedAnswers;
          });
        }}
      >
        {questions[index].answers.map((answer, indexAnswer) => (
          <Radio
            color={
              selectedAnswers[index] === questions[index].correctAnswer
                ? 'success'
                : 'danger'
            }
            key={indexAnswer}
            value={indexAnswer.toString()}
          >
            <div className="flex flex-row justify-center items-center gap-2">
              <p>{answer}</p>
              {selectedAnswers[index] === indexAnswer &&
                (selectedAnswers[index] === questions[index].correctAnswer ? (
                  <CheckIcon className="text-success size-6" />
                ) : (
                  <XMarkIcon className="text-danger size-6" />
                ))}
            </div>
          </Radio>
        ))}
      </RadioGroup>
      <div className="flex flex-row justify-center items-center gap-5 w-full self-center justify-self-center">
        <Button
          color="primary"
          variant="ghost"
          isIconOnly
          radius="full"
          size="sm"
          onPress={() =>
            setIndex((index - 1 + questions.length) % questions.length)
          }
        >
          <ChevronLeftIcon className="size-6" />
        </Button>
        <Button
          color="primary"
          variant="ghost"
          isIconOnly
          radius="full"
          size="sm"
          onPress={() => setIndex((index + 1) % questions.length)}
        >
          <ChevronRightIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
}

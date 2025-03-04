import { useState } from 'react';

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export function useQuestionsInterview(questions: string[]) {
  const [qa, setQa] = useState<QuestionAnswer[]>(() =>
    questions.map((question) => ({
      question,
      answer: '',
    })),
  );

  const updateAnswer = (index: number, answer: string) => {
    setQa((prev) => {
      const newQa = [...prev];
      newQa[index] = {
        ...newQa[index],
        answer,
      };
      return newQa;
    });
  };

  return {
    qa,
    updateAnswer,
  };
}

import { FlashcardsQuestionsDto } from '@/lib/dto/flashcard.dto';
import { BlockDto } from '@/lib/dto/block.dto';
import React, { useEffect, useState } from 'react';
import { useSubmit } from '@/components/session/hooks';
import WrapperExercise from '@/components/session/WrapperExercise';
import FlippedCard from '@/components/session/FlippedCard';
import { Button } from '@nextui-org/button';
import { Check, RotateCcw, X } from 'lucide-react';
import { ExerciseBottom } from '@/components/session/ExerciseBottom';
import { useDictionary } from '@/components/hooks';

interface FlashcardsProps {
  flashcards: FlashcardsQuestionsDto;
  sessionId: string;
  isActive: boolean;
  finishExam: (block: BlockDto) => void;
  hasFinishedExercise: boolean;
}

export default function Flashcards({
  flashcards,
  sessionId,
  isActive,
  finishExam,
  hasFinishedExercise,
}: FlashcardsProps) {
  const [flashcardsState, setFlashcardsState] =
    useState<FlashcardsQuestionsDto>(flashcards);

  useEffect(() => {
    setFlashcardsState(flashcards);
  }, [flashcards]);

  const { isFlipped, flipCard } = useFlipped(flashcards.flashcards.length);

  const { loading, handleSubmit } = useSubmit(
    '/api/answer/flashcards',
    finishExam,
  );

  const allAnswered = () => {
    return flashcardsState.flashcards.every(
      (flashcard) => flashcard.answer !== 'no-answered',
    );
  };

  const setResult = (index: number, answer: 'correct' | 'incorrect') => {
    setFlashcardsState((prevState) => {
      const newState = prevState;
      newState.flashcards[index].answer = answer;
      return newState;
    });
  };

  const dictionary = useDictionary('flashcards');

  return (
    <>
      {flashcardsState.flashcards.map((flashcard, index) => (
        <WrapperExercise
          questionId={flashcard.id}
          documentId={flashcards.documentId}
          partOrder={flashcards.partOrder}
          exercise="flashcards"
          key={index}
          hasFinishedExercise={hasFinishedExercise}
        >
          <div className="flex flex-col justify-between items-center gap-5 w-full">
            <FlippedCard
              isFlipped={isFlipped[index]}
              front={flashcard.front}
              back={flashcard.back}
              flip={() => flipCard(index)}
            />
            <div className="flex flex-row justify-evenly items-center w-full">
              <Button
                onPress={() => setResult(index, 'incorrect')}
                isIconOnly
                isDisabled={!isActive}
                variant={flashcard.answer === 'incorrect' ? 'solid' : 'ghost'}
                color="danger"
                radius="full"
                size="lg"
                aria-label={`${index + 1}. ${dictionary['incorrect']}`}
              >
                <X className="size-7 self-center" />
              </Button>
              <Button
                onPress={() => flipCard(index)}
                isIconOnly
                variant="solid"
                color="primary"
                radius="full"
                size="lg"
                aria-label={`${index + 1}. ${dictionary['rotate']}`}
              >
                <RotateCcw className="size-7 self-center" />
              </Button>
              <Button
                onPress={() => setResult(index, 'correct')}
                isIconOnly
                isDisabled={!isActive}
                variant={flashcard.answer === 'correct' ? 'solid' : 'ghost'}
                color="success"
                radius="full"
                size="lg"
                aria-label={`${index + 1}. ${dictionary['correct']}`}
              >
                <Check className="size-7 self-center" />
              </Button>
            </div>
          </div>
        </WrapperExercise>
      ))}
      <ExerciseBottom
        canSubmit={allAnswered() && isActive}
        loading={loading}
        submit={async () => {
          const formData = new FormData();
          formData.append('sessionId', sessionId);
          formData.append('answer', JSON.stringify(flashcardsState));
          await handleSubmit(formData);
        }}
        descriptionSubmit={dictionary['submit']}
      />
    </>
  );
}

const useFlipped = (numberOfCards: number) => {
  const [isFlipped, setIsFlipped] = useState(Array(numberOfCards).fill(false));

  const flipCard = (index: number) => {
    setIsFlipped((prevState) => {
      const newState = [...prevState];
      newState[index] = !prevState[index];
      return newState;
    });
  };

  return { isFlipped, flipCard };
};

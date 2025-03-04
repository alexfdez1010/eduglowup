import { QuizDto } from '@/lib/dto/quiz.dto';
import Quiz from '@/components/session/Quiz';
import { ShortQuestionsDto } from '@/lib/dto/short-questions.dto';
import ShortQuestions from '@/components/session/ShortQuestions';
import { TrueFalseQuestionsDto } from '@/lib/dto/true-false.dto';
import TrueFalseQuestions from '@/components/session/TrueFalseQuestions';
import { BlockDto, BlockTypeDto } from '@/lib/dto/block.dto';
import { StudySessionDto } from '@/lib/dto/study-session.dto';
import ConceptQuestions from '@/components/session/ConceptQuestions';
import { ConceptQuestionsDto } from '@/lib/dto/concept.dto';
import Flashcards from '@/components/session/Flashcards';
import { FlashcardsQuestionsDto } from '@/lib/dto/flashcard.dto';

interface BlockComponentProps {
  block: BlockDto;
  session: StudySessionDto;
  isActive: boolean;
  finishExam: (block: BlockDto) => void;
  hasFinishedExercise: boolean;
}

export default function BlockComponent({
  block,
  session,
  isActive,
  finishExam,
  hasFinishedExercise,
}: BlockComponentProps) {
  switch (block.type) {
    case BlockTypeDto.QUIZ:
      const quiz = block.content as QuizDto;
      return (
        <Quiz
          quiz={quiz}
          sessionId={session.id}
          isActive={isActive}
          finishExam={finishExam}
          hasFinishedExercise={hasFinishedExercise}
        />
      );
    case BlockTypeDto.FLASHCARDS:
      const flashcards = block.content as FlashcardsQuestionsDto;
      return (
        <Flashcards
          flashcards={flashcards}
          sessionId={session.id}
          isActive={isActive}
          finishExam={finishExam}
          hasFinishedExercise={hasFinishedExercise}
        />
      );
    case BlockTypeDto.SHORT:
      const shortQuestions = block.content as ShortQuestionsDto;
      return (
        <ShortQuestions
          shortQuestions={shortQuestions}
          sessionId={session.id}
          isActive={isActive}
          finishExam={finishExam}
          hasFinishedExercise={hasFinishedExercise}
        />
      );
    case BlockTypeDto.TRUE_FALSE:
      const trueFalseQuestions = block.content as TrueFalseQuestionsDto;
      return (
        <TrueFalseQuestions
          trueFalseQuestions={trueFalseQuestions}
          sessionId={session.id}
          isActive={isActive}
          finishExam={finishExam}
          hasFinishedExercise={hasFinishedExercise}
        />
      );
    case BlockTypeDto.CONCEPT:
      const conceptQuestions = block.content as ConceptQuestionsDto;
      return (
        <ConceptQuestions
          conceptQuestions={conceptQuestions}
          sessionId={session.id}
          isActive={isActive}
          finishExam={finishExam}
          hasFinishedExercise={hasFinishedExercise}
        />
      );
    default:
      return null;
  }
}

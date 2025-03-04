import { ExerciseDto } from '@/lib/dto/exercise.dto';

export interface FlashcardDto {
  id: string;
  partId: string;
  front: string;
  back: string;
  answer: 'no-answered' | 'correct' | 'incorrect';
}

export interface FlashcardsQuestionsDto extends ExerciseDto {
  flashcards: FlashcardDto[];
}

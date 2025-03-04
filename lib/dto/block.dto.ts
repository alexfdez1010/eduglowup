import { QuizDto } from '@/lib/dto/quiz.dto';
import { ShortQuestionsDto } from '@/lib/dto/short-questions.dto';
import { TrueFalseQuestionsDto } from '@/lib/dto/true-false.dto';
import { ConceptQuestionsDto } from '@/lib/dto/concept.dto';
import { FlashcardsQuestionsDto } from '@/lib/dto/flashcard.dto';

export enum BlockTypeDto {
  QUIZ = 'QUIZ',
  SHORT = 'SHORT',
  TRUE_FALSE = 'TRUE_FALSE',
  CONCEPT = 'CONCEPT',
  FLASHCARDS = 'FLASHCARDS',
}

export type ContentType =
  | QuizDto
  | ShortQuestionsDto
  | TrueFalseQuestionsDto
  | ConceptQuestionsDto
  | FlashcardsQuestionsDto;

export interface BlockDto {
  id?: string;
  order: number;
  type: BlockTypeDto;
  content: ContentType;
}

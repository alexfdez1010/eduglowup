import { ExerciseDto } from './exercise.dto';

export interface ShortQuestionDto {
  id: string;
  question: string;
  answer: string;
  partId: string;
  rubric?: string;
  isCorrect?: boolean;
}

export interface ShortQuestionsDto extends ExerciseDto {
  questions: ShortQuestionDto[];
}

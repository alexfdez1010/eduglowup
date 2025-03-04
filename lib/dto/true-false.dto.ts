import { ExerciseDto } from './exercise.dto';

export interface TrueFalseQuestionDto {
  id: string;
  question: string;
  partId: string;
  answer: 'true' | 'false' | 'no-answered';
  isTrue?: boolean;
  isCorrect?: boolean;
}

export interface TrueFalseQuestionsDto extends ExerciseDto {
  questions: TrueFalseQuestionDto[];
}

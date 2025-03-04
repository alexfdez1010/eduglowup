import { ExerciseDto } from './exercise.dto';

/**
 * Version of a question and answers that can be
 * sent to the client (avoiding circular references)
 */
export interface QuizQuestionDto {
  id: string;
  question: string;
  answers: string[];
  partId: string;
  answer?: number;
  correctAnswer?: number;
  isCorrect?: boolean;
}

/**
 * Version of a quiz that it is going to be sent to the client
 */
export interface QuizDto extends ExerciseDto {
  questions: QuizQuestionDto[];
}

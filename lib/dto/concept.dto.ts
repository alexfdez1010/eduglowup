import { ExerciseDto } from './exercise.dto';

export interface ConceptDto {
  id: string;
  partId: string;
  definition: string;
  concept?: string;
  isCorrect?: boolean;
}

export interface AnswerConceptoDto extends ConceptDto {
  answer: string;
}

export interface ConceptQuestionsDto extends ExerciseDto {
  questions: AnswerConceptoDto[];
  concepts: string[];
}

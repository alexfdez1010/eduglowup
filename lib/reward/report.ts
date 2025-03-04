export interface ReportReward {
  documentId: string;
  totalQuestions: number;
  correctQuestions: number;
  exerciseType: ExerciseType;
}

export enum ExerciseType {
  QUIZ = 'QUIZ',
  MULTIPLE = 'MULTIPLE',
  SHORT = 'SHORT',
  TRUE_FALSE = 'TRUE_FALSE',
  CONCEPT = 'CONCEPT',
  FLASHCARDS = 'FLASHCARDS',
}

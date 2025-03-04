export interface Report {
  totalQuestions: number;
  correctQuestions: number;
  questions: ReportQuestion[];
}

export interface ReportQuestion {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
}

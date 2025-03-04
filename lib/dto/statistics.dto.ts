export interface PartStatisticsDto {
  userId: string;
  partId: string;

  totalConceptQuestions: number;
  correctConceptQuestions: number;

  totalFlashcards: number;
  correctFlashcards: number;

  totalQuizQuestions: number;
  correctQuizQuestions: number;

  totalShortQuestions: number;
  correctShortQuestions: number;

  totalTrueFalseQuestions: number;
  correctTrueFalseQuestions: number;
}

export interface PartStatisticsWithDateDto extends PartStatisticsDto {
  date: string;
}

export interface GeneralStatisticsDto {
  userId: string;
  date: string;

  totalConceptQuestions: number;
  correctConceptQuestions: number;
  totalFlashcards: number;
  correctFlashcards: number;
  totalQuizQuestions: number;
  correctQuizQuestions: number;
  totalShortQuestions: number;
  correctShortQuestions: number;
  totalTrueFalseQuestions: number;
  correctTrueFalseQuestions: number;
}

export interface ItemStatistics {
  name: string;
  link?: string;
  progress: number;
}

export interface StudySessionDto {
  id: string;
  userId: string;
  startTime: Date;
  language: string;
  exercises: string[];
  activeExercise: boolean;
  documentId: string;
}

export interface StudySessionWithDocumentsNameDto extends StudySessionDto {
  documentName: string;
}

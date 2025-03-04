import { StudySessionDto } from '@/lib/dto/study-session.dto';
import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import { StudySessionRepository } from '@/lib/repositories/interfaces';
import { repositories } from '@/lib/repositories/repositories';
import {
  GenerateExerciseService,
  generateExerciseService,
} from '@/lib/services/generate-exercise-service';
import { UUID } from '@/lib/uuid';

export class SessionService {
  private readonly studySessionRepository: StudySessionRepository;
  private readonly generateExerciseService: GenerateExerciseService;
  private readonly authProvider: AuthProvider;

  constructor(
    studySessionRepository: StudySessionRepository,
    generateExerciseService: GenerateExerciseService,
    authProvider: AuthProvider,
  ) {
    this.studySessionRepository = studySessionRepository;
    this.generateExerciseService = generateExerciseService;
    this.authProvider = authProvider;
  }

  /**
   * Create a new session
   * @param documentId the id of the document to include in the session
   * @param selectExercises the names of the exercises to include in the session
   * @param language the language of the session
   * @returns the id of the session
   */
  async createSession(
    documentId: string,
    selectExercises: string[],
    language: string,
  ): Promise<string> {
    const userId = await this.authProvider.getUserId();

    const sessionId = UUID.generate();

    const session: StudySessionDto = {
      id: sessionId,
      userId: userId,
      language: language,
      startTime: new Date(),
      documentId: documentId,
      exercises: selectExercises,
      activeExercise: true,
    };

    await this.studySessionRepository.createSession(session);

    return sessionId;
  }

  async deleteSession(sessionId: string) {
    await this.studySessionRepository.deleteSession(sessionId);
  }
}

export const sessionService = new SessionService(
  repositories.studySession,
  generateExerciseService,
  authProvider,
);

import {
  CertificateRepository,
  ChatRepository,
  CompetitionRepository,
  CourseRepository,
  DashboardRepository,
  DocumentRepository,
  EmbeddingRepository,
  ExerciseRepository,
  ReviewRepository,
  RewardRepository,
  StatisticsRepository,
  StreakRepository,
  StudySessionRepository,
  TestABRepository,
  UserRepository,
  ProfileRepository,
} from '@/lib/repositories/interfaces';
import { FlashcardDto } from '@/lib/dto/flashcard.dto';
import { ShortQuestionDto } from '@/lib/dto/short-questions.dto';
import { TrueFalseQuestionDto } from '@/lib/dto/true-false.dto';
import { QuizQuestionDto } from '@/lib/dto/quiz.dto';
import { ConceptDto } from '@/lib/dto/concept.dto';
import { FlashcardRepositoryPrisma } from '@/lib/repositories/flashcard-repository-prisma';
import { UserRepositoryPrisma } from '@/lib/repositories/user-repository-prisma';
import { DocumentRepositoryPrisma } from '@/lib/repositories/document-repository-prisma';
import { StudySessionRepositoryPrisma } from '@/lib/repositories/study-session-repository-prisma';
import { EmbeddedRepositoryPrisma } from '@/lib/repositories/embedding-repository-prisma';
import { StatisticsRepositoryPrisma } from '@/lib/repositories/statistics-repository-prisma';
import { TestABRepositoryPrisma } from '@/lib/repositories/testab-repository-prisma';
import { RewardRepositoryPrisma } from '@/lib/repositories/reward-repository-prisma';
import { StreakRepositoryPrisma } from '@/lib/repositories/streak-repository-prisma';
import { DashboardRepositoryPrisma } from '@/lib/repositories/dashboard-repository-prisma';
import { ReviewRepositoryPrisma } from '@/lib/repositories/review-repository-prisma';
import { CompetitionRepositoryPrisma } from '@/lib/repositories/competition-repository-prisma';
import { ChatRepositoryPrisma } from '@/lib/repositories/chat-repository-prisma';
import { CourseRepositoryPrisma } from '@/lib/repositories/course-repository-prisma';
import { ShortQuestionsRepositoryPrisma } from '@/lib/repositories/short-questions-repository-prisma';
import { TrueFalseRepositoryPrisma } from '@/lib/repositories/true-false-repository-prisma';
import { QuizRepositoryPrisma } from '@/lib/repositories/quiz-repository-prisma';
import { ConceptRepositoryPrisma } from '@/lib/repositories/concept-repository-prisma';

import global from '@/lib/global';
import { CertificateRepositoryPrisma } from '@/lib/repositories/certificate-repository-prisma';
import { ProfileRepositoryPrisma } from '@/lib/repositories/profile-repository-prisma';

export class Repositories {
  public user: UserRepository;
  public profile: ProfileRepository;
  public document: DocumentRepository;
  public studySession: StudySessionRepository;
  public embedding: EmbeddingRepository;
  public statistics: StatisticsRepository;
  public testAB: TestABRepository;
  public reward: RewardRepository;
  public streak: StreakRepository;
  public dashboard: DashboardRepository;
  public review: ReviewRepository;
  public competition: CompetitionRepository;
  public chat: ChatRepository;
  public course: CourseRepository;
  public flashcards: ExerciseRepository<FlashcardDto>;
  public shortQuestions: ExerciseRepository<ShortQuestionDto>;
  public trueFalseQuestions: ExerciseRepository<TrueFalseQuestionDto>;
  public quizQuestions: ExerciseRepository<QuizQuestionDto>;
  public conceptQuestions: ExerciseRepository<ConceptDto>;
  public certificate: CertificateRepository;

  constructor(
    user: UserRepository,
    profile: ProfileRepository,
    document: DocumentRepository,
    studySession: StudySessionRepository,
    embedding: EmbeddingRepository,
    statistics: StatisticsRepository,
    testAB: TestABRepository,
    reward: RewardRepository,
    streak: StreakRepository,
    dashboard: DashboardRepository,
    review: ReviewRepository,
    competition: CompetitionRepository,
    chat: ChatRepository,
    course: CourseRepository,
    flashcards: ExerciseRepository<FlashcardDto>,
    shortQuestions: ExerciseRepository<ShortQuestionDto>,
    trueFalseQuestions: ExerciseRepository<TrueFalseQuestionDto>,
    quizQuestions: ExerciseRepository<QuizQuestionDto>,
    conceptQuestions: ExerciseRepository<ConceptDto>,
    certificate: CertificateRepository,
  ) {
    this.user = user;
    this.profile = profile;
    this.document = document;
    this.studySession = studySession;
    this.embedding = embedding;
    this.statistics = statistics;
    this.testAB = testAB;
    this.reward = reward;
    this.streak = streak;
    this.dashboard = dashboard;
    this.review = review;
    this.competition = competition;
    this.chat = chat;
    this.course = course;
    this.flashcards = flashcards;
    this.shortQuestions = shortQuestions;
    this.trueFalseQuestions = trueFalseQuestions;
    this.quizQuestions = quizQuestions;
    this.conceptQuestions = conceptQuestions;
    this.certificate = certificate;
  }
}

const client = global.prisma;

export const repositories = new Repositories(
  new UserRepositoryPrisma(client),
  new ProfileRepositoryPrisma(client),
  new DocumentRepositoryPrisma(client),
  new StudySessionRepositoryPrisma(client),
  new EmbeddedRepositoryPrisma(client),
  new StatisticsRepositoryPrisma(client),
  new TestABRepositoryPrisma(client),
  new RewardRepositoryPrisma(client),
  new StreakRepositoryPrisma(client),
  new DashboardRepositoryPrisma(client),
  new ReviewRepositoryPrisma(client),
  new CompetitionRepositoryPrisma(client),
  new ChatRepositoryPrisma(client),
  new CourseRepositoryPrisma(client),
  new FlashcardRepositoryPrisma(client),
  new ShortQuestionsRepositoryPrisma(client),
  new TrueFalseRepositoryPrisma(client),
  new QuizRepositoryPrisma(client),
  new ConceptRepositoryPrisma(client),
  new CertificateRepositoryPrisma(client),
);

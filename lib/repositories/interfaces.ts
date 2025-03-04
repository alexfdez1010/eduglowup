import { UserDto, UserWithPasswordDto } from '@/lib/dto/user.dto';
import { ConfigurationDto } from '@/lib/dto/configuration.dto';
import {
  DocumentDto,
  DocumentWithOwnerDto,
  DocumentCompleteDto,
} from '@/lib/dto/document.dto';
import { SectionDto } from '@/lib/dto/section.dto';
import {
  StudySessionDto,
  StudySessionWithDocumentsNameDto,
} from '@/lib/dto/study-session.dto';
import { BlockDto } from '@/lib/dto/block.dto';
import { QuizQuestionDto } from '@/lib/dto/quiz.dto';
import { TrueFalseQuestionDto } from '@/lib/dto/true-false.dto';
import { ShortQuestionDto } from '@/lib/dto/short-questions.dto';
import {
  PartStatisticsDto,
  PartStatisticsWithDateDto,
} from '@/lib/dto/statistics.dto';
import { PartDto } from '@/lib/dto/part.dto';
import { Graph } from '@/lib/graph';
import { ConceptDto } from '@/lib/dto/concept.dto';
import { InvitationDto } from '../dto/invitation.dto';
import { PasswordRetrievalDto } from '@/lib/dto/password-retrieval.dto';

import {
  ExperimentDto,
  ExperimentWithIdDto,
  UserAssignmentDto,
  UserAssignmentWithResultDto,
  VariantDto,
  VariantWithFullDataDto,
} from '@/lib/dto/experiment.dto';
import { Reward } from '@/lib/reward/reward';
import { StreakDto } from '@/lib/dto/streak.dto';
import { CodeOTPDto } from '@/lib/dto/otp.dto';
import { ReviewDto, ReviewWithUserDto } from '@/lib/dto/review.dto';
import { FlashcardDto } from '@/lib/dto/flashcard.dto';
import { MessageDto } from '@/lib/dto/message.dto';
import {
  CompleteCourseDto,
  CourseDto,
  OwnedCourseDto,
  CourseStateDto,
  CourseToPublishDto,
  CourseWithOwnerDto,
  CoursePublishedDto,
  CoursePublishPageDto,
} from '@/lib/dto/course.dto';
import { CertificateDto } from '@/lib/dto/certificate.dto';
import { ProfileDto } from '@/lib/dto/profile.dto';

export interface UserRepository {
  getUserById(id: string): Promise<UserDto | null>;
  getNumberOfUsers(): Promise<number>;

  getUserWithPasswordById(id: string): Promise<UserWithPasswordDto | null>;
  getUserByEmail(email: string): Promise<UserDto | null>;
  getUserWithPasswordByEmail(
    email: string,
  ): Promise<UserWithPasswordDto | null>;

  createUser(user: UserWithPasswordDto): Promise<string>;
  updateName(id: string, name: string): Promise<void>;
  updatePassword(id: string, password: string): Promise<void>;
  verifyUser(id: string): Promise<void>;
  deleteUser(id: string): Promise<void>;

  createConfiguration(configuration: ConfigurationDto): Promise<void>;
  updateConfiguration(configuration: ConfigurationDto): Promise<void>;
  getConfiguration(userId: string): Promise<ConfigurationDto>;
  deleteConfiguration(userId: string): Promise<void>;

  addMoney(userId: string, money: number): Promise<void>;
  chargeMoney(userId: string, money: number): Promise<void>;

  getInvitationOfUser(userId: string): Promise<InvitationDto>;
  getInvitation(token: string): Promise<InvitationDto>;
  updateInvitation(invitation: InvitationDto): Promise<void>;

  createPasswordToken(userId: string, token: string): Promise<void>;

  getPasswordToken(token: string): Promise<PasswordRetrievalDto | null>;

  deletePasswordToken(userId: string): Promise<boolean>;

  createOrUpdateCodeOTP(
    userId: string,
    code: number,
    timestamp: Date,
  ): Promise<void>;
  getCodeOTP(userId: string): Promise<CodeOTPDto | null>;
  removeCodeOTP(userId: string): Promise<void>;
  increaseUserTimeSpent(userId: string, minutes: number): Promise<void>;
}

export interface ProfileRepository {
  updateProfile(profile: ProfileDto): Promise<void>;
  getProfile(id: string): Promise<ProfileDto | null>;
  getUserProfile(userId: string): Promise<ProfileDto | null>;
  getUserProfileId(userId: string): Promise<string | null>;
  updateImageOfUser(userId: string, imageUrl: string): Promise<void>;
  getImageOfUser(userId: string): Promise<string | null>;
}

export interface DocumentRepository {
  getDocument(documentId: string): Promise<DocumentDto>;
  getDocuments(documentIds: string[]): Promise<DocumentDto[]>;
  getDocumentsOwnedByUser(userId: string): Promise<DocumentCompleteDto[]>;

  hasAccessToContent(userId: string, contentId: string): Promise<boolean>;
  isOwnerOfContent(userId: string, contentId: string): Promise<boolean>;

  getPartsByDocument(documentId: string): Promise<PartDto[]>;
  getPartByDocument(documentId: string, order: number): Promise<PartDto>;
  getNumberOfParts(documentId: string): Promise<number>;

  getSectionsByDocument(documentId: string): Promise<SectionDto[]>;
  getSectionsByPart(partId: string): Promise<SectionDto[]>;
  getSections(sectionIds: string[]): Promise<SectionDto[]>;

  getGraphOfParts(documentId: string): Promise<Graph<PartDto> | null>;
  getPartById(partId: string): Promise<PartDto | null>;
  getSectionById(sectionId: string): Promise<SectionDto | null>;

  getDocumentOfSection(sectionId: string): Promise<DocumentDto | null>;
  getDocumentOfPart(partId: string): Promise<DocumentWithOwnerDto | null>;

  createDocument(document: DocumentWithOwnerDto): Promise<void>;
  createParts(documentId: string, parts: PartDto[]): Promise<void>;
  createSections(sections: SectionDto[]): Promise<void>;
  createGraphOfParts(documentId: string, graph: Graph<PartDto>): Promise<void>;
  deleteParts(partIds: string[]): Promise<void>;
  deleteDocument(documentId: string): Promise<void>;

  getPartSummary(partId: string): Promise<string | null>;
  setPartSummary(partId: string, summary: string): Promise<void>;

  updateNameDocument(documentId: string, name: string): Promise<void>;
  updatePartName(partId: string, name: string): Promise<void>;
  getContentsOfCourse(courseId: string): Promise<DocumentDto[]>;
  getContentsOfUser(userId: string): Promise<DocumentDto[]>;
  addContentToCourse(contentId: string, courseId: string): Promise<void>;
}

export interface StudySessionRepository {
  getSessionsOfUser(
    userId: string,
  ): Promise<StudySessionWithDocumentsNameDto[]>;

  getDocumentOfSession(studySessionId: string): Promise<DocumentDto>;

  createSession(session: StudySessionDto): Promise<void>;
  deleteSession(studySessionId: string): Promise<void>;
  getSession(studySessionId: string): Promise<StudySessionDto>;

  setActiveExercise(
    studySessionId: string,
    activeExercise: boolean,
  ): Promise<void>;

  addBlock(studySessionId: string, block: BlockDto): Promise<string>;
  updateBlock(block: BlockDto): Promise<void>;
  getBlocks(studySessionId: string): Promise<BlockDto[]>;
  lastBlock(studySessionId: string): Promise<BlockDto>;
  lastExercise(studySessionId: string): Promise<BlockDto>;

  getNextExercise(studySessionId: string): Promise<BlockDto | null>;
  setNextExercise(studySessionId: string, block: BlockDto): Promise<void>;
}

export interface ExerciseRepository<T> {
  storeQuestions(questions: T[]): Promise<void>;
  getQuestionsOfPart(partId: string): Promise<T[]>;
  getQuestion(questionId: string): Promise<T>;
  getQuestions(questionIds: string[]): Promise<T[]>;
  feedbackQuestion(questionId: string, isPositive: boolean): Promise<void>;
  getExplanation(questionId: string): Promise<string | null>;
  createExplanation(questionId: string, explanation: string): Promise<void>;
}

export interface QuizRepository extends ExerciseRepository<QuizQuestionDto> {}
export interface TrueFalseRepository
  extends ExerciseRepository<TrueFalseQuestionDto> {}
export interface ShortQuestionsRepository
  extends ExerciseRepository<ShortQuestionDto> {}
export interface ConceptRepository extends ExerciseRepository<ConceptDto> {}
export interface FlashcardRepository extends ExerciseRepository<FlashcardDto> {}

export interface EmbeddingRepository {
  getEmbeddingOfSection(sectionId: string): Promise<number[]>;
  getTopSections(
    documentsId: string,
    embedding: number[],
    n: number,
  ): Promise<SectionDto[]>;
  saveEmbeddingOfSection(sectionId: string, embedding: number[]): Promise<void>;
}

export interface StatisticsRepository {
  getPartStatistics(
    userId: string,
    documentId: string,
  ): Promise<PartStatisticsDto>;

  getPartStatisticsToday(
    userId: string,
    partId: string,
  ): Promise<PartStatisticsWithDateDto | null>;

  getAllPartsStatistics(
    userId: string,
    contentId: string,
  ): Promise<PartStatisticsDto[]>;

  createOrUpdatePartStatistics(
    statistics: PartStatisticsWithDateDto,
  ): Promise<void>;

  getAllStatisticsOfUserPart(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<PartStatisticsWithDateDto[]>;
}

export interface TestABRepository {
  getExperiments(): Promise<ExperimentDto[]>;
  getVariantsOfExperiment(experimentName: string): Promise<VariantDto[]>;
  getUserAssignment(
    userId: string,
    experimentName: string,
  ): Promise<UserAssignmentDto | null>;
  saveUserAssignment(userAssignment: UserAssignmentDto): Promise<void>;
  updateResult(userAssignmentId: string, result: number): Promise<void>;
  getUserAssignmentsWithResult(
    experimentName: string,
  ): Promise<UserAssignmentWithResultDto[]>;
  getUserAssignmentId(
    userId: string,
    experimentName: string,
  ): Promise<string | null>;
}

export interface RewardRepository {
  getRewardsNotFulfilled(userId: string): Promise<Reward[]>;
  getRewardsFulfilled(userId: string): Promise<Reward[]>;
  createRewards(userId: string, rewards: Reward[]): Promise<void>;
  updateReward(
    rewardId: string,
    progress: number,
    isFulfilled: boolean,
  ): Promise<void>;

  hasInitialRewards(userId: string): Promise<boolean>;
  hasDocumentRewards(userId: string, documentId: string): Promise<boolean>;
}

export interface StreakRepository {
  getStreak(userId: string): Promise<StreakDto>;
  updateCreateStreak(streak: StreakDto): Promise<void>;
}

export interface DashboardRepository {
  getRegistrationsByDay(day: Date): Promise<number>;
  getAllDailyRegistrations(): Promise<{ date: string; userCount: number }[]>;
  getPageOfUsers(page: number, pageSize: number): Promise<UserDto[]>;
  getPageOfUsersByEmail(
    page: number,
    pageSize: number,
    emailPattern: string,
  ): Promise<UserDto[]>;
  getAmountOfUsersByEmail(emailPattern: string): Promise<number>;
  getAverageUsageByDay(stringDay: string): Promise<number>;
  getTotalTimeOfUsers(): Promise<number>;
  getTotalNumberOfInvitations(): Promise<number>;
  getNumberOfExercisesByType(): Promise<Record<string, number>>;
  getNumberOfDocuments(): Promise<number>;
  getNumberOfActiveUsers(currentWeek: string): Promise<number>;
  getNumberOfFriends(): Promise<number>;
  createTestAB(test: ExperimentDto, variants: VariantDto[]): Promise<boolean>;
  getAllTestsAB(): Promise<ExperimentWithIdDto[]>;
  getVariantsFromExperimentFullData(
    testId: string,
  ): Promise<VariantWithFullDataDto[]>;
  getNumberOfCourses(): Promise<number>;
  getNumberOfSignUpsInCourses(): Promise<number>;
  getTotalExercises(): Promise<number>;
}

export interface ReviewRepository {
  getReviewsOfCourse(courseId: string): Promise<ReviewWithUserDto[]>;
  createReview(review: ReviewDto): Promise<void>;
  hasMadeAReview(userId: string, courseId: string): Promise<boolean>;
  updateReview(review: ReviewDto): Promise<void>;
  removeReview(courseId: string, userId: string): Promise<void>;
}

export interface CompetitionRepository {
  getTopGeneralScores(week: string, top: number): Promise<UserCompetitionDto[]>;
  getTopFriendScores(
    week: string,
    userId: string,
    top: number,
  ): Promise<UserCompetitionDto[]>;
  getSelfScore(week: string, userId: string): Promise<UserCompetitionDto>;

  addUserToFriends(userId: string, friendId: string): Promise<void>;
  removeUserFromFriends(userId: string, friendId: string): Promise<void>;
  isAlreadyFriend(userId: string, friendId: string): Promise<boolean>;
  getFriendIdFromFriendCode(friendCode: string): Promise<string | null>;

  increaseScore(userId: string, week: string, score: number): Promise<void>;

  getFriendCode(userId: string): Promise<string | null>;
  setFriendCode(userId: string, friendCode: string): Promise<void>;

  getUsersWithFriends(): Promise<{ userId: string; numberOfFriends: number }[]>;
}

export interface ChatRepository {
  getMessagesOfPart(
    userId: string,
    partId: string,
    limit?: number,
  ): Promise<MessageDto[]>;
  getMessagesOfSession(
    sessionId: string,
    limit?: number,
  ): Promise<MessageDto[]>;

  addMessageToPart(
    userId: string,
    partId: string,
    message: MessageDto,
  ): Promise<void>;
  addMessageToSession(sessionId: string, message: MessageDto): Promise<void>;

  getTypicalQuestions(partId: string): Promise<string[]>;
  setTypicalQuestions(partId: string, questions: string[]): Promise<void>;
}

export interface CourseRepository {
  createCourse(course: CourseDto): Promise<void>;
  getOwnedCourses(userId: string): Promise<OwnedCourseDto[]>;
  getSignedUpCourses(userId: string): Promise<CourseDto[]>;
  getCourse(courseId: string): Promise<CompleteCourseDto | null>;
  hasSignedUpCourse(userId: string, courseId: string): Promise<boolean>;
  signUpToCourse(userId: string, courseId: string): Promise<void>;
  getAllCourses(): Promise<OwnedCourseDto[]>;
  getPublishedCourses(): Promise<CoursePublishedDto[]>;
  getAllCoursesDashboard(): Promise<CourseWithOwnerDto[]>;
  updateCourseState(id: string, state: CourseStateDto): Promise<boolean>;

  getAllKeywords(): Promise<{ id: string; name: string }[]>;
  addKeywords(keywords: { id: string; name: string }[]): Promise<void>;
  publishCourse(course: CourseToPublishDto): Promise<void>;
  getPublishedCourseById(courseId: string): Promise<CourseToPublishDto | null>;

  checkSlugAvailability(slug: string): Promise<boolean>;
  courseIsNotPublish(courseId: string): Promise<boolean>;

  getCourseBySlug(slug: string): Promise<CoursePublishPageDto | null>;

  getCoursesWhereThereIsContent(contentId: string): Promise<CourseDto[]>;
}

export interface CertificateRepository {
  getCertificate(certificateId: string): Promise<CertificateDto | null>;
  getCertificateOfUser(
    userId: string,
    courseId: string,
  ): Promise<CertificateDto | null>;
  createCertificate(certificate: CertificateDto): Promise<void>;
  getAllCertificatesOfUser(userId: string): Promise<CertificateDto[]>;
}

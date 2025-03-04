import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import {
  CourseRepository,
  DocumentRepository,
  StudySessionRepository,
} from '@/lib/repositories/interfaces';
import { repositories } from '@/lib/repositories/repositories';

export class GuardService {
  private readonly authProvider: AuthProvider;
  private readonly studySessionRepository: StudySessionRepository;
  private readonly documentRepository: DocumentRepository;
  private readonly courseRepository: CourseRepository;

  private readonly adminUsers = [
    'eduglowup@proton.me',
    'alejandrofernandezcamello@gmail.com',
    'oscarbanoscampos@proton.me',
    'tecnico9.343@gmail.com',
  ];

  constructor(
    authProvider: AuthProvider,
    studySessionRepository: StudySessionRepository,
    documentRepository: DocumentRepository,
    courseRepository: CourseRepository,
  ) {
    this.authProvider = authProvider;
    this.studySessionRepository = studySessionRepository;
    this.documentRepository = documentRepository;
    this.courseRepository = courseRepository;
  }

  /**
   * Check if the user is the owner of the course
   * @param courseId the id of the course
   * @param userId the id of the user, if null is will be retrieved from the auth provider
   * @returns true if the user is the owner of the course, false otherwise
   */
  async userIsOwnerOfCourse(
    courseId: string,
    userId?: string,
  ): Promise<boolean> {
    if (!userId) {
      userId = await this.authProvider.getUserId();
    }

    const course = await this.courseRepository.getCourse(courseId);

    if (!course) {
      return false;
    }

    return course.ownerId === userId;
  }

  /**
   * Check if the user has access to a course
   * @param courseId the id of the course
   * @param userId the id of the user, if null is will be retrieved from the auth provider
   * @returns true if the user has access to the course, false otherwise
   */
  async userHasAccessToCourse(
    courseId: string,
    userId?: string,
  ): Promise<boolean> {
    if (!userId) {
      userId = await this.authProvider.getUserId();
    }

    const [course, signedUp] = await Promise.all([
      this.courseRepository.getCourse(courseId),
      this.courseRepository.hasSignedUpCourse(userId, courseId),
    ]);

    if (!course) {
      return false;
    }

    return signedUp || course.ownerId === userId;
  }

  /**
   * Check if the user is the owner of the session
   * @param sessionId the id of the session
   * @param userId the id of the user, if null is will be retrieved from the auth provider
   * @returns true if the user is the owner of the session, false otherwise
   */
  async userIsOwnerOfSession(
    sessionId: string,
    userId?: string,
  ): Promise<boolean> {
    if (!userId) {
      userId = await this.authProvider.getUserId();
    }

    const session = await this.studySessionRepository.getSession(sessionId);

    if (!session) {
      return false;
    }

    return session.userId === userId;
  }

  /**
   * Check if the user has access to a particular document
   * @param contentId the id of the document
   * @param userId the id of the user, if null is will be retrieved from the auth provider
   * @returns true if the user has access to the document, false otherwise
   */
  async userHasAccessToContentt(
    contentId: string,
    userId?: string,
  ): Promise<boolean> {
    if (!userId) {
      userId = await this.authProvider.getUserId();
    }

    const isAdmin = await this.isAdminUser();

    const hasAccessToContent = await this.documentRepository.hasAccessToContent(
      userId,
      contentId,
    );

    return hasAccessToContent || isAdmin;
  }

  /**
   * Check if the user is the owner of the document
   * @param documentId the id of the document
   * @param userId the id of the user, if null is will be retrieved from the auth provider
   * @returns true if the user is the owner of the document, false otherwise
   */
  async userIsOwnerOfDocument(
    documentId: string,
    userId?: string,
  ): Promise<boolean> {
    if (!userId) {
      userId = await this.authProvider.getUserId();
    }

    return await this.documentRepository.isOwnerOfContent(userId, documentId);
  }

  async userHasAccessToPart(partId: string, userId?: string): Promise<boolean> {
    const part = await this.documentRepository.getPartById(partId);
    return await this.userHasAccessToContentt(part.documentId, userId);
  }

  async userIsOwnerOfPart(partId: string, userId?: string): Promise<boolean> {
    const document = await this.documentRepository.getDocumentOfPart(partId);
    if (!document) {
      return false;
    }

    const actualUserId = userId ?? (await this.authProvider.getUserId());
    return this.documentRepository.isOwnerOfContent(actualUserId, document.id);
  }

  async userHasAccessToPartByContent(
    contentId: string,
    order: number,
    userId?: string,
  ): Promise<boolean> {
    const part = await this.documentRepository.getPartByDocument(
      contentId,
      order,
    );
    if (!part) {
      return false;
    }

    return this.userHasAccessToPart(part.id, userId);
  }

  async userIsOwnerOfPartByContent(
    contentId: string,
    order: number,
    userId?: string,
  ): Promise<boolean> {
    const part = await this.documentRepository.getPartByDocument(
      contentId,
      order,
    );
    if (!part) {
      return false;
    }

    return this.userIsOwnerOfPart(part.id, userId);
  }

  async isAdminUser(): Promise<boolean> {
    const adminUser = await this.authProvider.getUser();
    return this.adminUsers.includes(adminUser.email);
  }

  /**
   * Check if the request has the bearer token to access to private routes
   * @param request the request
   * @returns true if the request has the bearer token and it is valid, false otherwise
   */
  async checkPrivateToken(request: Request): Promise<boolean> {
    const token = request.headers.get('Authorization');

    if (!token) {
      return false;
    }

    return process.env.PRIVATE_TOKEN === token;
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.authProvider.getUser();

    return !!user;
  }
}

export const guardService = new GuardService(
  authProvider,
  repositories.studySession,
  repositories.document,
  repositories.course,
);

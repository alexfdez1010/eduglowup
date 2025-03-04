import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import {
  CourseRepository,
  DocumentRepository,
  StatisticsRepository,
} from '@/lib/repositories/interfaces';
import { DocumentCompleteDto, DocumentDto } from '@/lib/dto/document.dto';
import { repositories } from '@/lib/repositories/repositories';
import { computeProgressOfContent } from '@/lib/progress';
import {
  resourceService,
  ResourceService,
} from '@/lib/services/resource-service';

export class ContentService {
  private readonly documentRepository: DocumentRepository;
  private readonly courseRepository: CourseRepository;
  private readonly statisticsRepository: StatisticsRepository;
  private readonly authProvider: AuthProvider;
  private readonly resourceService: ResourceService;

  constructor(
    documentRepository: DocumentRepository,
    courseRepository: CourseRepository,
    statisticsRepository: StatisticsRepository,
    authProvider: AuthProvider,
    resourceService: ResourceService,
  ) {
    this.documentRepository = documentRepository;
    this.courseRepository = courseRepository;
    this.statisticsRepository = statisticsRepository;
    this.authProvider = authProvider;
    this.resourceService = resourceService;
  }

  async getContentsOfCourse(courseId: string): Promise<DocumentCompleteDto[]> {
    const userId = await this.authProvider.getUserId();

    if (!userId) {
      return [];
    }

    const [contents, course] = await Promise.all([
      this.documentRepository.getContentsOfCourse(courseId),
      this.courseRepository.getCourse(courseId),
    ]);

    const progress = await Promise.all(
      contents.map((content) => this.computeProgress(userId, content.id)),
    );

    return contents.map((content, index) => ({
      ...content,
      isOwner: course.ownerId === userId,
      progress: progress[index],
    }));
  }

  async getContensOfUser(): Promise<DocumentCompleteDto[]> {
    const userId = await this.authProvider.getUserId();

    if (!userId) {
      return [];
    }

    const [contents] = await Promise.all([
      this.documentRepository.getContentsOfUser(userId),
    ]);

    const progress = await Promise.all(
      contents.map((content) => this.computeProgress(userId, content.id)),
    );

    return contents.map((content, index) => ({
      ...content,
      isOwner: true,
      progress: progress[index],
    }));
  }

  async getContent(contentId: string): Promise<DocumentDto> {
    return this.documentRepository.getDocument(contentId);
  }

  async getTemporalUrl(contentId: string): Promise<string | null> {
    const content = await this.documentRepository.getDocument(contentId);

    if (!content.url) {
      return null;
    }

    return this.resourceService.getTemporaryUrl(content.url);
  }

  private async computeProgress(
    userId: string,
    contentId: string,
  ): Promise<number> {
    const [parts, partStatistics] = await Promise.all([
      this.documentRepository.getPartsByDocument(contentId),
      this.statisticsRepository.getAllPartsStatistics(userId, contentId),
    ]);

    return computeProgressOfContent(parts, partStatistics);
  }

  async updateNameContent(contentId: string, name: string): Promise<void> {
    await this.documentRepository.updateNameDocument(contentId, name);
  }

  async addContentToCourse(contentId: string, courseId: string): Promise<void> {
    await this.documentRepository.addContentToCourse(contentId, courseId);
  }

  /**
   * Delete the document with uuid given
   * if the user has the right permissions
   *
   * @param contentId id of the document to delete
   */
  async deleteContent(contentId: string): Promise<void> {
    const content = await this.documentRepository.getDocument(contentId);
    await Promise.all([
      this.documentRepository.deleteDocument(contentId),
      content.url && this.resourceService.deleteFile(content.url),
    ]);
  }
}

export const contentService = new ContentService(
  repositories.document,
  repositories.course,
  repositories.statistics,
  authProvider,
  resourceService,
);

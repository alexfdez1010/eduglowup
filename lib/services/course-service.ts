import { CourseRepository } from '@/lib/repositories/interfaces';
import {
  CompleteCourseDto,
  CourseDto,
  OwnedCourseDto,
  CourseStateDto,
  CourseToPublishDto,
  CourseWithOwnerDto,
  CoursePublishedDto,
  CoursePublishPageDto,
  CourseWithProgressDto,
} from '@/lib/dto/course.dto';
import { repositories } from '@/lib/repositories/repositories';
import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import {
  resourceService,
  ResourceService,
} from '@/lib/services/resource-service';
import { UUID } from '@/lib/uuid';
import { contentService, ContentService } from '@/lib/services/content-service';

export class CourseService {
  private readonly courseRepository: CourseRepository;
  private readonly authProvider: AuthProvider;
  private readonly resourceService: ResourceService;
  private readonly contentService: ContentService;

  constructor(
    courseRepository: CourseRepository,
    authProvider: AuthProvider,
    resourceService: ResourceService,
    contentService: ContentService,
  ) {
    this.courseRepository = courseRepository;
    this.authProvider = authProvider;
    this.resourceService = resourceService;
    this.contentService = contentService;
  }

  async createCourse(course: CourseDto): Promise<void> {
    const userId = await this.authProvider.getUserId();
    course.ownerId = userId;
    await this.courseRepository.createCourse(course);
  }

  async getOwnedCourses(): Promise<OwnedCourseDto[]> {
    const userId = await this.authProvider.getUserId();
    return await this.courseRepository.getOwnedCourses(userId);
  }

  async getSignedUpCourses(): Promise<CourseWithProgressDto[]> {
    const userId = await this.authProvider.getUserId();

    if (!userId) return [];

    const courses = await this.courseRepository.getSignedUpCourses(userId);

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => ({
        ...course,
        progress: await this.getCourseProgress(course.id),
      })),
    );

    return coursesWithProgress;
  }

  async getCourse(courseId: string): Promise<CompleteCourseDto | null> {
    return await this.courseRepository.getCourse(courseId);
  }

  async getCourseBySlug(slug: string): Promise<CoursePublishPageDto | null> {
    const course = await this.courseRepository.getCourseBySlug(slug);
    course.imageUrl = await this.resourceService.getTemporaryUrl(
      course.imageUrl,
    );
    return course;
  }

  async getAllCoursesInDashboard(): Promise<CourseWithOwnerDto[]> {
    return await this.courseRepository.getAllCoursesDashboard();
  }

  async getPublishedCourses(): Promise<CoursePublishedDto[]> {
    const courses = await this.courseRepository.getPublishedCourses();

    for (const course of courses) {
      course.imageUrl = await this.resourceService.getTemporaryUrl(
        course.imageUrl,
      );
    }

    return courses;
  }

  async isSignedUp(courseId: string): Promise<boolean> {
    const userId = await this.authProvider.getUserId();

    if (!userId) {
      return false;
    }

    return await this.courseRepository.hasSignedUpCourse(userId, courseId);
  }

  async signUpToCourse(userId: string, courseId: string): Promise<void> {
    await this.courseRepository.signUpToCourse(userId, courseId);
  }

  async updateCourseState(
    courseId: string,
    state: CourseStateDto,
  ): Promise<void> {
    await this.courseRepository.updateCourseState(courseId, state);
  }

  async getKeywords(ids?: string[]): Promise<string[]> {
    const keywords = await this.courseRepository.getAllKeywords();

    if (!ids) {
      return keywords.map((keyword) => keyword.name);
    }

    return keywords
      .filter((keyword) => ids.includes(keyword.id))
      .map((keyword) => keyword.name);
  }

  async publishCourse(
    courseId: string,
    title: string,
    description: string,
    price: number,
    image: File,
    keywords: string[],
    useSmartPricing: boolean,
    thereshold: number,
  ): Promise<boolean> {
    let slug = title
      .toLowerCase()
      .replace(/[^\w]+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    const [imageUrl, completeKeywords, slugAvailable, notPublished] =
      await Promise.all([
        this.resourceService.uploadFile(image),
        this.addKeywords(keywords),
        this.courseRepository.checkSlugAvailability(slug),
        this.courseRepository.courseIsNotPublish(courseId),
      ]);

    if (!slugAvailable && notPublished) {
      slug = `${slug}-${UUID.generate().slice(0, 8)}`;
    }

    const courseToPublish: CourseToPublishDto = {
      id: courseId,
      title: title,
      slug: slug,
      description: description,
      price: price,
      imageUrl: imageUrl,
      keywordsIds: completeKeywords.map((keyword) => keyword.id),
      useSmartPricing: useSmartPricing,
      threshold: thereshold,
    };

    await Promise.all([
      this.courseRepository.publishCourse(courseToPublish),
      notPublished &&
        this.courseRepository.updateCourseState(
          courseId,
          CourseStateDto.Published,
        ),
    ]);

    return !notPublished;
  }

  async getPublishedCourseById(
    courseId: string,
  ): Promise<CourseToPublishDto | null> {
    return this.courseRepository.getPublishedCourseById(courseId);
  }

  private async addKeywords(
    keywords: string[],
  ): Promise<{ id: string; name: string }[]> {
    const originalKeywords = await this.courseRepository.getAllKeywords();

    // First get existing keywords that match our selection
    const existingKeywords = originalKeywords.filter((k) =>
      keywords.includes(k.name),
    );

    // Then find which keywords are new and need to be created
    const newKeywordNames = keywords.filter(
      (keyword) => !originalKeywords.map((k) => k.name).includes(keyword),
    );

    const newKeywords = newKeywordNames.map((keyword) => ({
      id: UUID.generate(),
      name: keyword,
    }));

    if (newKeywords.length > 0) {
      await this.courseRepository.addKeywords(newKeywords);
    }

    // Return both existing and new keywords
    return [...existingKeywords, ...newKeywords];
  }

  async getCourseProgress(courseId: string): Promise<number> {
    const contents = await this.contentService.getContentsOfCourse(courseId);

    const progress = contents.reduce((acc, content) => {
      return acc + content.progress;
    }, 0);

    return contents.length > 0 ? progress / contents.length : 0;
  }
}

export const courseService = new CourseService(
  repositories.course,
  authProvider,
  resourceService,
  contentService,
);

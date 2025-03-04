import { PrismaClient } from '@prisma/client';
import {
  CompleteCourseDto,
  CourseDto,
  CoursePublishedDto,
  CoursePublishPageDto,
  CourseStateDto,
  CourseToPublishDto,
  CourseWithOwnerDto,
  OwnedCourseDto,
} from '@/lib/dto/course.dto';
import { CourseRepository } from '@/lib/repositories/interfaces';
import { CourseState } from '@prisma/client';
import bcrypt from 'bcryptjs';

const courseStateMapDtoToPrisma: Map<CourseStateDto, CourseState> = new Map([
  [CourseStateDto.NotPublished, CourseState.NotPublished],
  [CourseStateDto.Published, CourseState.Published],
]);

const courseStateMapPrismaToDto: Map<CourseState, CourseStateDto> = new Map(
  Array.from(courseStateMapDtoToPrisma.entries()).map(([key, value]) => [
    value,
    key,
  ]),
);

const dtoToPrisma = (state: CourseStateDto): CourseState => {
  return courseStateMapDtoToPrisma.get(state);
};

const prismaToDto = (state: CourseState): CourseStateDto => {
  return courseStateMapPrismaToDto.get(state);
};

const createCourseSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export class CourseRepositoryPrisma implements CourseRepository {
  private client: PrismaClient;
  private readonly saltRounds = 10;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getPublishedCourseById(
    courseId: string,
  ): Promise<CourseToPublishDto | null> {
    const course = await this.client.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        keywords: true,
      },
    });

    if (!course) {
      return null;
    }

    return {
      id: course.id,
      title: course.title,
      slug: course.slug ?? undefined,
      description: course.description ?? undefined,
      price: course.price ?? undefined,
      imageUrl: course.imageUrl ?? undefined,
      useSmartPricing: course.useSmartPricing,
      keywordsIds: course.keywords.map((keyword) => keyword.id),
      threshold: course.thresholdToGiveCertificate,
    };
  }

  async createCourse(course: CourseDto): Promise<void> {
    if (course.language === undefined || course.language === '') {
      throw new Error('Language is required');
    }
    await this.client.course.create({
      data: {
        id: course.id,
        title: course.title,
        language: course.language,
        ownerId: course.ownerId,
        useSmartPricing: false,
      },
    });
  }

  async getOwnedCourses(userId: string): Promise<OwnedCourseDto[]> {
    const courses = await this.client.course.findMany({
      where: {
        ownerId: userId,
      },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      language: course.language,
      ownerId: course.ownerId,
      state: prismaToDto(course.state),
    }));
  }

  async getSignedUpCourses(userId: string): Promise<CourseDto[]> {
    const courses = await this.client.course.findMany({
      where: {
        usersWithAccess: {
          some: {
            id: userId,
          },
        },
      },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      language: course.language,
      ownerId: course.ownerId,
    }));
  }

  async getCourse(courseId: string): Promise<CompleteCourseDto | null> {
    const course = await this.client.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        keywords: true,
      },
    });

    if (!course) {
      return null;
    }

    return {
      id: course.id,
      title: course.title,
      language: course.language,
      ownerId: course.ownerId,
      slug: course.slug ?? undefined,
      description: course.description ?? undefined,
      price: course.price ?? undefined,
      imageUrl: course.imageUrl ?? undefined,
      useSmartPricing: course.useSmartPricing,
      keywords: course.keywords.map((keyword) => keyword.name),
      threshold: course.thresholdToGiveCertificate,
    };
  }

  async hasSignedUpCourse(userId: string, courseId: string): Promise<boolean> {
    const course = await this.client.course.findUnique({
      where: {
        id: courseId,
        usersWithAccess: {
          some: {
            id: userId,
          },
        },
      },
    });

    return !!course;
  }

  async signUpToCourse(userId: string, courseId: string): Promise<void> {
    await this.client.course.update({
      where: {
        id: courseId,
      },
      data: {
        usersWithAccess: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getAllCourses(): Promise<OwnedCourseDto[]> {
    const courses = await this.client.course.findMany({
      include: {
        keywords: true,
      },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      language: course.language,
      ownerId: course.ownerId,
      state: prismaToDto(course.state),
    }));
  }

  async getPublishedCourses(): Promise<CoursePublishedDto[]> {
    const courses = await this.client.course.findMany({
      where: {
        state: CourseState.Published,
      },
      include: {
        keywords: true,
        owner: true,
        reviews: {
          select: {
            stars: true,
          }
        }
      },
    });

    return courses.map((course) => ({
      title: course.title,
      language: course.language,
      keywords: course.keywords.map((keyword) => keyword.name),
      ownerId: course.ownerId,
      slug: course.slug,
      price: course.price,
      imageUrl: course.imageUrl,
      useSmartPricing: course.useSmartPricing,
      ownerName: course.owner.name,
      averageRating:  course.reviews.length ? Number((course.reviews.reduce((acc, review) => acc + review.stars, 0) / course.reviews.length).toFixed(1)) : 0,
    }));
  }

  async getAllCoursesDashboard(): Promise<CourseWithOwnerDto[]> {
    const courses = await this.client.course.findMany({
      include: {
        owner: true,
      },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      language: course.language,
      ownerId: course.ownerId,
      ownerName: course.owner.name,
      email: course.owner.email,
    }));
  }

  async updateCourseState(id: string, state: CourseStateDto): Promise<boolean> {
    await this.client.course.update({
      where: {
        id: id,
      },
      data: {
        state: dtoToPrisma(state),
      },
    });

    return true;
  }

  async getAllKeywords(): Promise<{ id: string; name: string }[]> {
    const keywords = await this.client.keywords.findMany();
    return keywords;
  }

  async addKeywords(keywords: { id: string; name: string }[]): Promise<void> {
    await this.client.keywords.createMany({
      data: keywords,
    });
  }

  async publishCourse(course: CourseToPublishDto): Promise<void> {
    const existingCourse = await this.client.course.findUnique({
      where: { id: course.id },
      include: { keywords: true },
    });

    const existingKeywordIds = existingCourse?.keywords.map((k) => k.id) || [];
    const keywordsToDisconnect = existingKeywordIds.filter(
      (id) => !course.keywordsIds.includes(id),
    );

    await this.client.course.update({
      where: { id: course.id },
      data: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        price: course.price,
        imageUrl: course.imageUrl,
        useSmartPricing: course.useSmartPricing,
        keywords: {
          disconnect: keywordsToDisconnect.map((id) => ({ id })),
          connect: course.keywordsIds.map((id) => ({ id })),
        },
        thresholdToGiveCertificate: course.threshold,
      },
    });
  }

  async checkSlugAvailability(slug: string): Promise<boolean> {
    const courses = await this.client.course.findMany({
      where: {
        slug: slug,
      },
    });

    return courses.length === 0;
  }

  async courseIsNotPublish(courseId: string): Promise<boolean> {
    const course = await this.client.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return false;
    }

    return course.state === CourseState.NotPublished;
  }

  async getCourseBySlug(slug: string): Promise<CoursePublishPageDto | null> {
    const course = await this.client.course.findFirst({
      where: {
        slug: slug,
      },
      include: {
        keywords: true,
        owner: true,
        reviews: {
          select: {
            stars: true,
          }
        }
      },
    });

    if (!course) {
      return null;
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      language: course.language,
      ownerId: course.ownerId,
      keywords: course.keywords.map((keyword) => keyword.name),
      slug: course.slug,
      price: course.price,
      imageUrl: course.imageUrl,
      useSmartPricing: course.useSmartPricing,
      ownerName: course.owner.name,
      averageRating:  course.reviews.length ? Number((course.reviews.reduce((acc, review) => acc + review.stars, 0) / course.reviews.length).toFixed(1)) : 0,
    };
  }

  async getCoursesWhereThereIsContent(contentId: string): Promise<CourseDto[]> {
    const courses = await this.client.course.findMany({
      where: {
        contents: {
          some: {
            id: contentId,
          },
        },
      },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      language: course.language,
      ownerId: course.ownerId,
    }));
  }
}

import { ReviewDto, ReviewWithUserDto } from '@/lib/dto/review.dto';
import { ReviewRepository } from '@/lib/repositories/interfaces';
import { PrismaClient } from '@prisma/client';

export class ReviewRepositoryPrisma implements ReviewRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async createReview(review: ReviewDto): Promise<void> {
    await this.client.courseReview.create({ data: review });
  }

  async getReviewsOfCourse(courseId: string): Promise<ReviewWithUserDto[]> {
    const reviews = await this.client.courseReview.findMany({
      where: {
        courseId: courseId,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return reviews.map((review) => {
      return {
        courseId: review.courseId,
        userId: review.userId,
        stars: review.stars,
        comment: review.comment,
        user: {
          name: review.user.name,
          photo: review.user.profile?.imageUrl,
        },
      };
    });
  }

  async removeReview(courseId: string, userId: string): Promise<void> {
    await this.client.courseReview.delete({
      where: {
        courseId_userId: {
          courseId: courseId,
          userId: userId,
        },
      },
    });
  }

  async updateReview(review: ReviewDto): Promise<void> {
    await this.client.courseReview.update({
      where: {
        courseId_userId: {
          courseId: review.courseId,
          userId: review.userId,
        },
      },
      data: {
        stars: review.stars,
        comment: review.comment,
      },
    });
  }

  async hasMadeAReview(userId: string, courseId: string): Promise<boolean> {
    const review = await this.client.courseReview.findFirst({
      where: {
        courseId: courseId,
        userId: userId,
      },
    });

    return review !== null;
  }
}

import { ReviewRepository } from '@/lib/repositories/interfaces';
import { ReviewDto, ReviewWithUserDto } from '@/lib/dto/review.dto';
import { repositories } from '@/lib/repositories/repositories';
import { resourceService, ResourceService } from './resource-service';

export class ReviewService {
  private readonly reviewRepository: ReviewRepository;
  private readonly resourceService: ResourceService;

  constructor(
    reviewRepository: ReviewRepository,
    resourceService: ResourceService,
  ) {
    this.reviewRepository = reviewRepository;
    this.resourceService = resourceService;
  }

  async getReviewsOfCourse(courseId: string): Promise<ReviewWithUserDto[]> {
    const reviews = await this.reviewRepository.getReviewsOfCourse(courseId);

    for (const review of reviews) {
      if (review.user.photo) {
        review.user.photo = await this.resourceService.getTemporaryUrl(
          review.user.photo,
        );
      }
    }

    return reviews;
  }

  async hasMadeAReview(userId: string, courseId: string): Promise<boolean> {
    return this.reviewRepository.hasMadeAReview(userId, courseId);
  }

  async createReview(review: ReviewDto): Promise<void> {
    await this.reviewRepository.createReview(review);
  }

  async updateReview(review: ReviewDto): Promise<void> {
    await this.reviewRepository.updateReview(review);
  }
}

export const reviewService = new ReviewService(
  repositories.review,
  resourceService,
);

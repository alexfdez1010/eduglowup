export interface CourseDto {
  id: string;
  title: string;
  language: string;
  ownerId: string;
}

export interface OwnedCourseDto extends CourseDto {
  state: CourseStateDto;
}

export interface CourseWithOwnerDto extends CourseDto {
  email: string;
  ownerName: string;
}

export interface CompleteCourseDto extends CourseDto {
  slug?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  useSmartPricing?: boolean;
  keywords: string[];
  threshold: number;
}

export interface CoursePublishedDto {
  title: string;
  slug: string;
  language: string;
  ownerId: string;
  price: number;
  imageUrl: string;
  keywords: string[];
  useSmartPricing: boolean;
  ownerName: string;
  averageRating?: number;
}

export interface CoursePublishPageDto extends CoursePublishedDto {
  id: string;
  description: string;
}

export interface CourseToPublishDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  keywordsIds: string[];
  useSmartPricing: boolean;
  threshold: number;
}

export enum CourseStateDto {
  NotPublished = 'NotPublished',
  Published = 'Published',
}

export interface CourseWithProgressDto extends CourseDto {
  progress: number;
}

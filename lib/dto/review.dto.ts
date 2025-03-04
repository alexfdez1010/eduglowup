export interface ReviewDto {
  courseId: string;
  userId: string;
  stars: number;
  comment?: string;
}

export interface ReviewWithUserDto extends ReviewDto {
  user: {
    name: string;
    photo: string;
  };
}

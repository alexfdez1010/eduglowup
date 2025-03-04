import ReactStars from 'react-rating-star-with-type';
import { Avatar } from '@nextui-org/avatar';
import { ReviewWithUserDto } from '@/lib/dto/review.dto';
import { Card, CardBody } from '@nextui-org/react';

import NextImage from 'next/image';
import Rating from './Rating';

interface ReviewCardProps {
  review: ReviewWithUserDto;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card
      className="flex flex-col justify-center items-center w-96 h-64 p-2"
      shadow="sm"
    >
      <CardBody className="grid grid-rows-10 gap-4">
        <div className="row-span-3 grid grid-cols-4 gap-4 items-center w-full h-full">
          <div className="col-span-1">
            <Avatar
              ImgComponent={NextImage}
              imgProps={{
                width: 80,
                height: 80,
                title: review.user.name,
                loading: 'eager',
              }}
              src={review.user.photo}
              alt={review.user.name}
              size="lg"
              name={review.user.name.charAt(0).toUpperCase()}
              showFallback
              radius="full"
              className="self-center"
            />
          </div>
          <div className="col-span-3 flex flex-col items-start justify-between h-full gap-1">
            <p className="text-left font-semibold text-lg">
              {review.user.name}
            </p>
            <Rating rating={review.stars} />
          </div>
        </div>
        {review.comment && (
          <blockquote className="row-span-7 text-left text-tiny mb-4 text-pretty self-start mt-4">
            "{review.comment}"
          </blockquote>
        )}
      </CardBody>
    </Card>
  );
}

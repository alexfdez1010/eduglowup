import { Card } from '@nextui-org/card';
import { CardBody } from '@nextui-org/react';
import { Avatar } from '@nextui-org/avatar';
import NextImage from 'next/image';
import { Stars } from '@/components/landing-page/Stars';

export interface TestimonialCardInterface {
  name: string;
  occupation: string;
  testimonial: string;
  image?: string;
}

export default function TestimonialCard({
  name,
  occupation,
  testimonial,
  image,
}: TestimonialCardInterface) {
  return (
    <Card
      className="flex flex-col justify-center items-center w-96 h-64 px-1"
      shadow="sm"
    >
      <CardBody className="grid grid-rows-10 gap-4">
        <div className="row-span-4 grid grid-cols-4 gap-4 items-center w-full h-full">
          <div className="col-span-1">
            <Avatar
              ImgComponent={NextImage}
              imgProps={{
                width: 80,
                height: 80,
                title: name,
                loading: 'eager',
              }}
              src={image}
              alt={name}
              size="lg"
              name={name[0]}
              showFallback
              radius="full"
              className="self-center"
            />
          </div>
          <div className="col-span-3 flex flex-col items-start justify-between h-full gap-1">
            <p className="text-left font-semibold text-lg">{name}</p>
            <p className="text-left text-gray-600 dark:text-gray-400 text-sm">
              {occupation}
            </p>
            <Stars />
          </div>
        </div>
        <blockquote className="row-span-6 text-left text-tiny mb-4 text-pretty self-center">
          "{testimonial}"
        </blockquote>
      </CardBody>
    </Card>
  );
}

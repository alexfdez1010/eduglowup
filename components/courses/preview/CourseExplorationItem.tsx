import { CoursePublishedDto } from '@/lib/dto/course.dto';
import { Card, CardFooter } from '@nextui-org/card';
import { useDictionary } from '@/components/hooks';
import NextLink from 'next/link';
import { Image } from '@nextui-org/image';
import NextImage from 'next/image';
import ChipContainer from '@/components/general/ChipContainer';
import { getLanguageLabel } from '@/common/language';
import { Chip } from '@nextui-org/react';
import ReactStars from 'react-rating-star-with-type';
import React from 'react';

interface CourseExplorationItemProps {
  course: CoursePublishedDto;
}

export default function CourseExplorationItem({
  course,
}: CourseExplorationItemProps) {
  const dictionary = useDictionary('courses');

  const price = course.useSmartPricing ? 2 * course.price : course.price;

  const language = getLanguageLabel(course.language);

  return (
    <Card
      isPressable
      as={NextLink}
      href={`/courses/${course.slug}`}
      className="hover:scale-105 transition-all duration-200 ease-in-out size-[350px] max-w-full relative"
    >
      <Image
        as={NextImage}
        src={course.imageUrl}
        className="object-cover"
        width={350}
        height={350}
      />
      <CardFooter className="flex flex-col w-full justify-start items-start absolute bottom-0 z-10 p-4 bg-background bg-opacity-90 gap-3">
        {course.averageRating!==0 && (
          <ReactStars
            count={5}
            value={course.averageRating}
            size={24}
            isEdit={false}
            classNames="text-primary"
          />
        )}
        <div className="flex flex-row justify-between w-full">
          <h2 className="text-md font-semibold">{course.title}</h2>
          {price === 0 ? (
            <Chip color="danger">{dictionary['free']}</Chip>
          ) : (
            <h4 className="text-md font-semibold min-w-[30px]">{price} €</h4>
          )}
        </div>
        <div className="flex flex-row justify-between w-full">
          <h3 className="text-sm font-semibold">{course.ownerName}</h3>
          <Chip color="primary" size="sm" className="text-xs">
            {language}
          </Chip>
        </div>
      </CardFooter>
    </Card>
  );
}

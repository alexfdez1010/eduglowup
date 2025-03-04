'use client';

import { CoursePublishPageDto } from '@/lib/dto/course.dto';
import Title from '@/components/general/Title';
import { Chip, Image } from '@nextui-org/react';
import NextImage from 'next/image';

import ButtonSignUpCourse from '@/components/courses/ButtonSignUpCourse';
import ChipContainer from '@/components/general/ChipContainer';
import { useDictionary } from '@/components/hooks';
import { Gem } from 'lucide-react';
import { ProfileDto } from '@/lib/dto/profile.dto';
import { Avatar } from '@nextui-org/avatar';

import NextLink from 'next/link';
import MarkdownComplete from '@/components/general/MarkdownComplete';

interface CoursePageProps {
  course: CoursePublishPageDto;
  profileOfInstructor: ProfileDto | null;
  isSignedUp: boolean;
}

export default function CoursePage({
  course,
  profileOfInstructor,
  isSignedUp,
}: CoursePageProps) {
  const dictionary = useDictionary('courses');

  const price = course.useSmartPricing ? 2 * course.price : course.price;
  const diamonds = price * 100;

  return (
    <div className="flex flex-col gap-12 justify-center items-center mt-24 w-11/12">
      <Title title={course.title} />
      <div className="sm:grid sm:grid-cols-2 flex flex-col-reverse gap-6 mx-auto w-full">
        <div className="flex flex-col w-full items-center">
          <MarkdownComplete
            className="mx-auto text-center bg-blue-400"
            text={course.description}
          />
        </div>
        <div className="flex flex-col items-center gap-6">
          <Image
            as={NextImage}
            src={course.imageUrl}
            width={250}
            height={250}
          />
          <ButtonSignUpCourse isSignedUpInCourse={isSignedUp} course={course} />
          {profileOfInstructor ? (
            <NextLink
              href={`/profile/${profileOfInstructor.id}`}
              className="flex items-center gap-3"
            >
              <CoursePageInstructor
                ownerName={course.ownerName}
                imageUrl={profileOfInstructor.imageUrl}
              />
            </NextLink>
          ) : (
            <div className="flex items-center gap-3">
              <CoursePageInstructor ownerName={course.ownerName} />
            </div>
          )}
          {price === 0 ? (
            <Chip color="danger" size="lg">{dictionary['free']}</Chip>
          ) : (
            <p className="flex flex-wrap items-baseline">
              {dictionary['price']}: {price} € {dictionary['o']} {diamonds}{' '}
              <Gem className="size-3 text-primary ml-1" />
            </p>
          )}
          <ChipContainer
            items={course.keywords}
            color="primary"
            className="max-w-sm"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

const CoursePageInstructor = ({
  ownerName,
  imageUrl,
}: {
  ownerName: string;
  imageUrl?: string;
}) => {
  return (
    <>
      <Avatar
        ImgComponent={NextImage}
        className="text-xl"
        src={imageUrl}
        isBordered
        imgProps={{ width: 160, height: 160 }}
        name={ownerName.charAt(0).toUpperCase()}
        showFallback
        alt={ownerName}
        color="primary"
        size="sm"
      />
      <h2 className="text-lg font-semibold">{ownerName}</h2>
    </>
  );
};

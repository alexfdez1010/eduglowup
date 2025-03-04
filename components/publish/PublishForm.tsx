'use client';

import { Input, Checkbox } from '@nextui-org/react';
import { CourseDto, CourseToPublishDto } from '@/lib/dto/course.dto';
import FormWithFeedbackManagement from '../general/FormWithFeedbackManagement';
import Title from '@/components/general/Title';
import { useDictionary } from '@/components/hooks';
import HiddenInputCourseId from '@/components/content/HiddenInputCourseId';
import ButtonWithSpinner from '../general/ButtonWithSpinner';
import { publishCourse } from '@/lib/actions/courses';
import { FileUpload } from '@/components/content/FileUpload';
import Description from '@/components/publish/Description';
import Keywords from './Keywords';

interface PublishFormProps {
  course: CourseToPublishDto;
  keywords: string[];
}

export function PublishForm({ course, keywords }: PublishFormProps) {
  const dictionary = useDictionary('courses');

  return (
    <>
      <Title title={dictionary['publish']} />
      <FormWithFeedbackManagement
        className="flex flex-col justify-center items-center gap-6 mt-12 w-full max-w-4xl"
        action={publishCourse}
        errorAsToast
      >
        <div className="w-11/12 flex sm:flex-row flex-col justify-between sm:items-start gap-12">
          <div className="w-full flex flex-col justify-center items-center gap-3">
            <HiddenInputCourseId />
            <Input
              variant="faded"
              color="primary"
              label={dictionary['course-title']}
              name="title"
              description={dictionary['course-title-description']}
              defaultValue={course.title}
            />
            <Description description={course.description} />
            <Input
              label={dictionary['course-price']}
              type="number"
              name="price"
              description={dictionary['course-price-description']}
              min={0}
              max={3000}
              defaultValue={course.price?.toString() ?? '25'}
              startContent={
                <span className="text-default-400 pointer-events-none flex flex-col justify-center">
                  €
                </span>
              }
            />
            <Input
              label={dictionary['course-threshold']}
              type="number"
              name="threshold"
              description={dictionary['course-threshold-description']}
              defaultValue={course.threshold?.toString() ?? '50'}
              min={30}
              max={90}
              startContent={
                <span className="text-default-400 pointer-events-none flex flex-col justify-center">
                  %
                </span>
              }
            />
          </div>
          <div className="w-full flex flex-col justify-center items-center gap-3">
            <FileUpload
              accept="image/*"
              text={dictionary['course-image']}
              name="image"
            />
            <Keywords keywordsCourse={keywords} />
            <Checkbox
              name="useSmartPricing"
              defaultSelected={course.useSmartPricing ?? false}
              value="true"
            >
              Smart pricing
            </Checkbox>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dictionary['smart-pricing-description']}
            </p>
          </div>
        </div>
        <ButtonWithSpinner color="primary" isActive={true}>
          {dictionary['publish']}
        </ButtonWithSpinner>
      </FormWithFeedbackManagement>
    </>
  );
}

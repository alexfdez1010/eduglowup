'use client';

import { useDictionary } from '@/components/hooks';
import { Button } from '@nextui-org/react';
import { MoveRight } from 'lucide-react';
import FormWithFeedbackManagement from '../general/FormWithFeedbackManagement';
import ButtonWithSpinner from '../general/ButtonWithSpinner';
import { CoursePublishPageDto } from '@/lib/dto/course.dto';
import { signUpToCourse } from '@/lib/actions/courses';

interface ButtonSignUpCourseProps {
  course: CoursePublishPageDto;
  isSignedUpInCourse: boolean;
}

export default function ButtonSignUpCourse({
  course,
  isSignedUpInCourse,
}: ButtonSignUpCourseProps) {
  const dictionary = useDictionary('courses');

  const text = isSignedUpInCourse
    ? dictionary['go-to-course']
    : dictionary['sign-up-in-course'];

  return (
    <FormWithFeedbackManagement
      action={signUpToCourse}
      className="flex flex-col justify-center items-center gap-3"
      errorAsToast
    >
      <input type="hidden" name="courseId" value={course.id} />
      <input type="hidden" name="slug" value={course.slug} />
      <ButtonWithSpinner isActive={true} color="success" size="lg">
        {text}
      </ButtonWithSpinner>
    </FormWithFeedbackManagement>
  );
}

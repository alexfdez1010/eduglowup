'use client';

import { OwnedCourseDto } from '@/lib/dto/course.dto';
import OwnedCourseList from '@/components/courses/OwnedCourseList';
import CoursesHeader from '@/components/courses/CoursesHeader';
import ModalWrapper from '@/components/modal/ModalWrapper';
import CreateCourseForm from '@/components/courses/CreateCourseForm';
import { useDictionary } from '@/components/hooks';
import { useLaunchModal } from '../modal/use-launch-modal';

interface CoursesCreateProps {
  courses: OwnedCourseDto[];
}

export default function CoursesCreate({ courses }: CoursesCreateProps) {
  const dictionary = useDictionary('courses');

  const launchModal = useLaunchModal();

  return (
    <>
      <CoursesHeader
        title={dictionary['title-create']}
        cta={dictionary['create-course']}
        action={() => launchModal('create-course')}
      />
      <OwnedCourseList courses={courses} />
      <ModalWrapper
        keyModal="create-course"
        title={dictionary['create-course']}
        content={<CreateCourseForm />}
      />
    </>
  );
}

'use client';

import { useDictionary } from '@/components/hooks';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { Input } from '@nextui-org/input';
import LanguageSelector from '@/components/courses/LanguageSelector';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import { useState } from 'react';
import { createCourse } from '@/lib/actions/courses';

export default function CreateCourseForm() {
  const dictionary = useDictionary('courses');

  const [name, setName] = useState('');

  return (
    <FormWithFeedbackManagement
      action={createCourse}
      className="flex flex-col gap-4"
      errorAsToast
    >
      <Input
        name="title"
        value={name}
        onValueChange={(value) => setName(value)}
        label={dictionary['course-name']}
        placeholder={dictionary['course-name-placeholder']}
        variant="faded"
        data-cy="create-course-name"
        isRequired
      />
      <LanguageSelector />
      <ButtonWithSpinner
        isActive={name.length > 0}
        color="primary"
        dataCy="create-course-submit"
      >
        {dictionary['create-course']}
      </ButtonWithSpinner>
    </FormWithFeedbackManagement>
  );
}

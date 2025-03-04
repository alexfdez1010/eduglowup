'use client';

import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { useDictionary } from '@/components/hooks';
import Rating from './Rating';
import { Textarea } from '@nextui-org/react';
import ButtonWithSpinner from '../general/ButtonWithSpinner';
import { submitReview } from '@/lib/actions/review';

interface ReviewFormProps {
  courseId: string;
  slug: string;
  isSignedUp: boolean;
}

export default function ReviewForm({
  courseId,
  slug,
  isSignedUp,
}: ReviewFormProps) {
  const dictionary = useDictionary('courses');

  return (
    <FormWithFeedbackManagement
      action={submitReview}
      className="w-full max-w-2xl flex flex-col justify-center items-center gap-5"
    >
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="slug" value={slug} />
      <Rating isEditable={isSignedUp} className="self-start" />
      <Textarea
        isReadOnly={!isSignedUp}
        name="comment"
        label={dictionary['comment']}
        placeholder={dictionary['write-your-review-here']}
        rows={5}
      />
      <ButtonWithSpinner isActive={isSignedUp} color="primary">
        {dictionary['submit-review']}
      </ButtonWithSpinner>
    </FormWithFeedbackManagement>
  );
}

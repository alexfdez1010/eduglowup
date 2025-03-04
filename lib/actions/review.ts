'use server';

import { State } from '@/lib/interfaces';
import { z } from 'zod';
import { authProvider } from '@/lib/providers/auth-provider';
import { reviewService } from '@/lib/services/review-service';
import { revalidatePath } from 'next/cache';
import { getDictionaryInActions, urlWithLocale } from '@/lib/actions/utils';
import { courseService } from '../services/course-service';
import { dictionaries } from '@/app/[locale]/dictionaries';

const formSchema = z.object({
  slug: z.string(),
  courseId: z.string().uuid(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(0).max(1000),
});

export async function submitReview(_prevState: State, formData: FormData) {
  const dictionary = getDictionaryInActions('courses');

  const parsedFormData = formSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsedFormData.success) {
    return {
      isError: true,
      message: dictionary['no-rating-given'],
    };
  }

  const { slug, courseId, rating, comment } = parsedFormData.data;

  const userId = await authProvider.getUserId();

  if (!userId) {
    throw new Error('You must be logged in to submit a review');
  }

  const isSignedUp = await courseService.isSignedUp(courseId);

  if (!isSignedUp) {
    throw new Error('You must be signed up to submit a review');
  }

  const review = {
    courseId: courseId,
    userId: userId,
    stars: rating,
    comment: comment,
  };

  const hasMadeAReview = await reviewService.hasMadeAReview(userId, courseId);

  if (hasMadeAReview) {
    await reviewService.updateReview(review);
  } else {
    await reviewService.createReview(review);
  }

  revalidatePath(urlWithLocale(`/courses/${slug}`));

  return { isError: false, message: dictionary['review-submitted'] };
}

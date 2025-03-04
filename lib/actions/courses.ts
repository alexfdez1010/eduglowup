'use server';

import { courseService } from '@/lib/services/course-service';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { i18n } from '@/i18n-config';
import { ActionWithState, State } from '@/lib/interfaces';
import { UUID } from '../uuid';
import { authProvider } from '../providers/auth-provider';
import { revalidatePath } from 'next/cache';
import { getDictionaryInActions, urlWithLocale } from './utils';
import { z } from 'zod';
import { guardService } from '../services/guard-service';
import { CourseStateDto } from '../dto/course.dto';
import { redirect } from 'next/navigation';

export const createCourse: ActionWithState = async (
  _prevState: State,
  formData: FormData,
) => {
  const title = formData.get('title') as string;
  const language = formData.get('language') as string;

  const dictionary = getDictionary(i18n.defaultLocale)['courses'];

  const userId = await authProvider.getUserId();

  if (!userId) {
    return {
      isError: true,
      message: dictionary['create-course-error'],
    };
  }

  try {
    await courseService.createCourse({
      id: UUID.generate(),
      title,
      language,
      ownerId: userId,
    });

    revalidatePath(urlWithLocale('/app/create'));

    return {
      isError: false,
      message: dictionary['create-course-success'],
    };
  } catch (error) {
    return {
      isError: true,
      message: dictionary['create-course-error'],
    };
  }
};

export const getCourses = async () => {
  const dictionary = getDictionary(i18n.defaultLocale)['courses'];

  try {
    const isAdmin = await guardService.isAdminUser();

    if (!isAdmin) {
      return {
        isError: true,
        courses: [],
        message: dictionary['error-server'],
      };
    }

    const courses = await courseService.getAllCoursesInDashboard();

    return {
      isError: false,
      courses: courses,
      message: '',
    };
  } catch (error) {
    return {
      isError: true,
      courses: [],
      message: dictionary['error-server'],
    };
  }
};

const publishFormSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(0).max(3000),
  image: z.instanceof(File),
  keywords: z.string(),
  useSmartPricing: z.string().optional(),
  threshold: z.coerce.number().min(30).max(90),
});

export const publishCourse = async (_prevState: State, formData: FormData) => {
  const data = publishFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  const dictionary = getDictionaryInActions('courses');

  if (!data.success) {
    console.log(data.error);
    return {
      isError: true,
      message: dictionary['you-must-fill-all-fields'],
    };
  }

  const {
    courseId,
    title,
    description,
    price,
    image,
    keywords,
    useSmartPricing,
    threshold,
  } = data.data;

  const isRepublished = await courseService.publishCourse(
    courseId,
    title,
    description,
    price,
    image,
    keywords.split('\n').filter((k) => k.length > 0),
    useSmartPricing === 'true',
    threshold,
  );

  if (!isRepublished) {
    return {
      isError: false,
      message: dictionary['already-published'],
    };
  }

  return {
    isError: false,
    message: dictionary['publish-success'],
  };
};

export async function signUpToCourse(_prevState: State, formData: FormData) {
  const courseId = formData.get('courseId') as string;
  const slug = formData.get('slug') as string;

  const userId = await authProvider.getUserId();

  if (!userId) {
    const redirectUrl = urlWithLocale(`/courses/${slug}`);
    const url = `/sign-up?redirect=${redirectUrl}`;
    redirect(url);
  }

  const isSignedUp = await courseService.isSignedUp(courseId);

  if (!isSignedUp) {
    await courseService.signUpToCourse(userId, courseId);
  }

  redirect(urlWithLocale(`/app/courses/${courseId}`));
}

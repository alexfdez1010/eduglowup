import { authProvider } from '@/lib/providers/auth-provider';
import { exercisesService } from '@/lib/services/exercises-service';
import { z } from 'zod';

const schema = z.object({
  exercise: z.string(),
  questionId: z.string().uuid(),
  isPositive: z.enum(['true', 'false']),
});

export async function POST(req: Request): Promise<Response> {
  const formData = await req.formData();

  const parsedData = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsedData.success) {
    return new Response('Invalid form data', { status: 400 });
  }

  const { exercise: exerciseName, questionId, isPositive } = parsedData.data;

  const userId = await authProvider.getUserId();

  if (userId === null) {
    return new Response('You must be logged in to give feedback', {
      status: 401,
    });
  }

  const exercise = exercisesService.getExerciseByName(exerciseName);

  if (!exercise) {
    return new Response('Exercise not found', { status: 404 });
  }

  await exercise.feedback(questionId, isPositive === 'true');

  return new Response('Feedback sent', { status: 200 });
}

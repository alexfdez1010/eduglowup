import { z } from 'zod';
import { generateExerciseService } from '@/lib/services/generate-exercise-service';

const formSchema = z.object({
  sessionId: z.string(),
});

export async function POST(req: Request): Promise<Response> {
  const formData = await req.formData();

  const objectParsed = formSchema.safeParse(Object.fromEntries(formData));

  if (!objectParsed.success) {
    throw new Error('Invalid form data');
  }

  const sessionId = objectParsed.data.sessionId;

  const block = await generateExerciseService.getExercise(sessionId);

  return Response.json({ block });
}

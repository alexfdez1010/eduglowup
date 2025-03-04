import { explanationService } from '@/lib/services/explanation-service';

export async function GET(
  _req: Request,
  { params }: { params: { exercise: string; questionId: string } },
): Promise<Response> {
  const exercise = params.exercise;
  const questionId = params.questionId;

  const explanation = await explanationService.getExplanation(
    exercise,
    questionId,
  );

  return Response.json({ explanation });
}

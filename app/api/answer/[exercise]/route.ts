import { AnswerType } from '@/lib/exercises/interface';
import { exercisesService } from '@/lib/services/exercises-service';
import { repositories } from '@/lib/repositories/repositories';
import { BlockDto, BlockTypeDto } from '@/lib/dto/block.dto';
import { answerService } from '@/lib/services/answer-service';
import { streakService } from '@/lib/services/streak-service';

export async function POST(
  req: Request,
  { params }: { params: { exercise: string } },
): Promise<Response> {
  const formData = await req.formData();

  const sessionId = formData.get('sessionId') as string;
  const answer = JSON.parse(formData.get('answer') as string) as AnswerType;

  const [block, rewards] = await answerService.answer(
    sessionId,
    params.exercise,
    answer,
  );

  if (!block) {
    return new Response('The exercise does not exist', { status: 404 });
  }

  streakService.updateStreak().catch((e) => console.error(e));

  return Response.json({ block, rewards });
}

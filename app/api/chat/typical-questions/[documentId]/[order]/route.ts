import { chatService } from '@/lib/services/chat-service';
import { guardService } from '@/lib/services/guard-service';
import { repositories } from '@/lib/repositories/repositories';

type Params = {
  params: { documentId: string; order: string };
};

export async function GET(
  _req: Request,
  { params }: Params,
): Promise<Response> {
  const documentId = params.documentId;
  const order = parseInt(params.order);

  const part = await repositories.document.getPartByDocument(documentId, order);

  const hasAccessToPart = await guardService.userHasAccessToPart(part.id);

  if (!hasAccessToPart) {
    return new Response('Forbidden', { status: 403 });
  }

  const questions = await chatService.getTypicalQuestions(part.id);

  return Response.json({ questions });
}

import { chatService } from '@/lib/services/chat-service';
import { guardService } from '@/lib/services/guard-service';

type Params = {
  params: { partId: string };
};

export async function GET(
  _req: Request,
  { params }: Params,
): Promise<Response> {
  const partId = params.partId;

  const hasAccessToPart = await guardService.userHasAccessToPart(partId);

  if (!hasAccessToPart) {
    return new Response('Forbidden', { status: 403 });
  }

  const messages = await chatService.getMessagesOfPart(partId);

  return Response.json({ messages });
}

export async function POST(
  req: Request,
  { params }: Params,
): Promise<Response> {
  const partId = params.partId;

  const hasAccessToPart = await guardService.userHasAccessToPart(partId);

  if (!hasAccessToPart) {
    return new Response('Forbidden', { status: 403 });
  }

  const formData = await req.formData();

  const message = formData.get('message') as string;

  const newMessage = await chatService.askInPart(partId, message);

  return Response.json({ message: newMessage });
}

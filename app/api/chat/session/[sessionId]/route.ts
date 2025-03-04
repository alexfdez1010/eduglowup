import { chatService } from '@/lib/services/chat-service';
import { guardService } from '@/lib/services/guard-service';

type Params = {
  params: { sessionId: string };
};

export async function GET(
  _req: Request,
  { params }: Params,
): Promise<Response> {
  const sessionId = params.sessionId;

  const hasAccessToSession = await guardService.userIsOwnerOfSession(sessionId);

  if (!hasAccessToSession) {
    return new Response('Forbidden', { status: 403 });
  }

  const messages = await chatService.getMessagesOfSession(sessionId);

  return Response.json({ messages });
}

export async function POST(
  req: Request,
  { params }: Params,
): Promise<Response> {
  const sessionId = params.sessionId;

  const hasAccessToSession = await guardService.userIsOwnerOfSession(sessionId);

  if (!hasAccessToSession) {
    return new Response('Forbidden', { status: 403 });
  }

  const formData = await req.formData();

  const message = formData.get('message') as string;

  const newMessage = await chatService.askInSession(sessionId, message);

  return Response.json({ message: newMessage });
}

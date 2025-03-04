import { repositories } from '@/lib/repositories/repositories';
import { authProvider } from '@/lib/providers/auth-provider';

export async function POST(req: Request) {
  const user = await authProvider.getUser();

  if (!user) {
    return new Response('No user', { status: 200 });
  }

  const data = (await req.json()) as { minutes: string };
  const minutesString = data.minutes;
  const minutes = parseInt(minutesString);

  if (isNaN(minutes) || minutes < 0 || minutes > 30) {
    return new Response('Invalid minutes', { status: 400 });
  }

  await repositories.user.increaseUserTimeSpent(user.id, minutes);

  return new Response('Success', { status: 200 });
}

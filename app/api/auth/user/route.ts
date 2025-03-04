import { getSession } from '@/lib/auth/auth';
import { repositories } from '@/lib/repositories/repositories';

export async function GET(_req: Request): Promise<Response> {
  const session = await getSession();

  if (!session || !session.isLoggedIn) {
    return Response.json({ user: null });
  }

  const user = await repositories.user.getUserById(session.userId);

  return Response.json({ user });
}

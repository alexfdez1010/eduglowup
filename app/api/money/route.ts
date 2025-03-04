import { economicService } from '@/lib/services/economic-service';
import { authProvider } from '@/lib/providers/auth-provider';

export async function GET(_req: Request): Promise<Response> {
  const userId = await authProvider.getUserId();

  if (!userId) {
    return Response.json({ money: 100 });
  }

  const money = await economicService.getMoney(userId);

  return Response.json({ money });
}

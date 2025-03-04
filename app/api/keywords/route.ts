import { authProvider } from '@/lib/providers/auth-provider';
import { courseService } from '@/lib/services/course-service';

export async function GET(req: Request): Promise<Response> {
  const isLoggedIn = await authProvider.getUserId();

  if (!isLoggedIn) {
    return Response.json({ keywords: [] });
  }

  const keywords = await courseService.getKeywords();

  return Response.json({ keywords });
}

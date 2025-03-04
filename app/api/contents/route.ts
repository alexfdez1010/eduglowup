import { contentService } from '@/lib/services/content-service';

export async function GET(_request: Request) {
  const contents = await contentService.getContensOfUser();
  return Response.json(contents);
}

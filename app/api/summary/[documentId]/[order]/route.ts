import { summaryService } from '@/lib/services/summary-service';
import { guardService } from '@/lib/services/guard-service';
import { revalidatePath } from 'next/cache';
import { urlWithLocale } from '@/lib/actions/utils';

export async function GET(
  _req: Request,
  { params }: { params: { documentId: string; order: string } },
): Promise<Response> {
  const { documentId, order: orderString } = params;

  const order = parseInt(orderString);

  if (!documentId || isNaN(order)) {
    return new Response('Invalid request', { status: 400 });
  }

  const hasAccess = await guardService.userHasAccessToPartByContent(
    documentId,
    order,
  );
  if (!hasAccess) {
    return new Response('Forbidden', { status: 403 });
  }

  const summary = await summaryService.getSummary(documentId, order);
  if (!summary) {
    return new Response('Not found', { status: 404 });
  }

  return Response.json({ summary });
}

export async function POST(
  req: Request,
  { params }: { params: { documentId: string; order: string } },
): Promise<Response> {
  const { documentId, order: orderString } = params;
  const order = parseInt(orderString);

  if (!documentId || isNaN(order)) {
    return new Response('Invalid request', { status: 400 });
  }

  const isOwner = await guardService.userIsOwnerOfPartByContent(
    documentId,
    order,
  );
  if (!isOwner) {
    return new Response('Forbidden', { status: 403 });
  }

  const body = await req.json();
  const { summary } = body;

  if (!summary || typeof summary !== 'string') {
    return new Response('Invalid markdown', { status: 400 });
  }

  const success = await summaryService.updateSummary(
    documentId,
    order,
    summary,
  );

  if (!success) {
    return new Response('Invalid markdown', { status: 400 });
  }

  revalidatePath(
    urlWithLocale(`/app/content/${documentId}/summaries/${order}`),
  );

  return new Response('OK', { status: 200 });
}

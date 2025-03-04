import Editor from '@/components/editor/Editor';
import { guardService } from '@/lib/services/guard-service';
import { summaryService } from '@/lib/services/summary-service';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: { id: string; locale: string; order: string };
}) {
  const contentId = params.id;
  const order = parseInt(params.order);

  const canEdit = await guardService.userIsOwnerOfPartByContent(
    contentId,
    order,
  );

  if (!canEdit) {
    notFound();
  }

  const summary = await summaryService.getSummary(contentId, order);

  const markdown = `# ${summary.title}\n\n${summary.markdown}`;

  return (
    <Editor initialMarkdown={markdown} contentId={contentId} order={order} />
  );
}

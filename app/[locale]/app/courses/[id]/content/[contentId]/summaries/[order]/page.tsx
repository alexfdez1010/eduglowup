import SummaryServer from '@/components/summary/SummaryServer';

export default async function Page({
  params,
}: {
    params: { contentId: string; order: string; id: string };
}) {
  const contentId = params.contentId;
  const order = parseInt(params.order);
  const courseId = params.id;

  return (
    <SummaryServer
      contentId={contentId}
      order={order}
      courseId={courseId}
    />
  );
}
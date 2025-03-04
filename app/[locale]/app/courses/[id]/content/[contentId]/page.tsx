import ContentServer from '@/components/content/ContentServer';

export default async function Page({
  params,
}: {
  params: { contentId: string; locale: string, id: string };
}) {
  const contentId = params.contentId;
  const courseId = params.id;

  return <ContentServer contentId={contentId} courseId={courseId} />;
}

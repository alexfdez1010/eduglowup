import { redirect } from 'next/navigation';
import { contentService } from '@/lib/services/content-service';
import { ContentType } from '@/lib/dto/document.dto';
import { urlWithLocale } from '@/lib/actions/utils';
import ContentShow from '@/components/content/ContentShow';
import { exercisesService } from '@/lib/services/exercises-service';
import ContentServer from '@/components/content/ContentServer';

export default async function Page({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const contentId = params.id;
  return (
    <ContentServer contentId={contentId} />
  );
}

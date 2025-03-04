import { redirect } from 'next/navigation';
import { contentService } from '@/lib/services/content-service';
import { ContentType } from '@/lib/dto/document.dto';
import ContentShow from '@/components/content/ContentShow';
import { exercisesService } from '@/lib/services/exercises-service';
import AppendToPath from '@/components/general/AppendToPath';

interface ContentServerProps {
  contentId: string;
  courseId?: string;
}

export default async function ContentServer({ contentId, courseId }: ContentServerProps) {
  const [content, temporalUrl, exercisesNames] = await Promise.all([
    contentService.getContent(contentId),
    contentService.getTemporalUrl(contentId),
    exercisesService.getExercises(),
  ]);

  if (content.type === ContentType.TEXT) {
    return <AppendToPath append={"/summaries/1"} />;
  }

  if (content.type === ContentType.URL) {
    redirect(temporalUrl);
  }

  return (
    <ContentShow
      temporalUrl={temporalUrl}
      content={content}
      exercisesNames={exercisesNames.map((exercise) => exercise.getName())}
      courseId={courseId}
    />
  );
}

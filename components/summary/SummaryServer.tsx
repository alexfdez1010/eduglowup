import { repositories } from '@/lib/repositories/repositories';
import ContentSummary from '@/components/summary/ContentSummary';
import { exercisesService } from '@/lib/services/exercises-service';
import { notFound } from 'next/navigation';
import { authProvider } from '@/lib/providers/auth-provider';
import { guardService } from '@/lib/services/guard-service';
import { summaryService } from '@/lib/services/summary-service';

interface SummaryServerProps {
  contentId: string;
  order: number;
  courseId?: string;
}

export default async function SummaryServer({
  contentId,
  order,
  courseId,
}: SummaryServerProps) {
  if (!contentId || !order) {
    return notFound();
  }

  const [part, document, numberOfParts, user] = await Promise.all([
    repositories.document.getPartByDocument(contentId, order),
    repositories.document.getDocument(contentId),
    repositories.document.getNumberOfParts(contentId),
    authProvider.getUser(),
  ]);

  if (!user) {
    return notFound();
  }

  if (!document) {
    return notFound();
  }

  if (order > numberOfParts) {
    return notFound();
  }

  if (!(await guardService.userHasAccessToContentt(contentId, user.id))) {
    return notFound();
  }

  const exercisesNames = exercisesService
    .getExercises()
    .map((exercise) => exercise.getName());

  const summary = await summaryService.getSummary(contentId, order);

  const isOwner = await guardService.userIsOwnerOfPartByContent(
    contentId,
    order,
    user.id,
  );

  return (
    <ContentSummary
      document={document}
      summary={summary}
      partId={part.id}
      order={order}
      numberOfParts={numberOfParts}
      exercisesNames={exercisesNames}
      isOwner={isOwner}
      courseId={courseId}
    />
  );
}

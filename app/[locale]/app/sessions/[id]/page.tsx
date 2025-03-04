import { notFound } from 'next/navigation';
import ExerciseSession from '@/components/session/ExerciseSession';
import { repositories } from '@/lib/repositories/repositories';
import { authProvider } from '@/lib/providers/auth-provider';
import { generateExerciseService } from '@/lib/services/generate-exercise-service';
import { LocalePagePropsWithId } from '@/app/[locale]/interfaces';

export default async function SessionPage({ params }: LocalePagePropsWithId) {
  const id = params.id;

  if (!id) {
    notFound();
  }

  const [session, blocks] = await Promise.all([
    repositories.studySession.getSession(id),
    repositories.studySession.getBlocks(id),
  ]);

  if (!session) {
    notFound();
  }

  const userId = await authProvider.getUserId();

  if (session.userId !== userId) {
    notFound();
  }

  if (blocks.length === 0) {
    const block = await generateExerciseService.generateExercise(id);
    generateExerciseService.getExercise(id).catch(console.error);

    blocks.push(block);
    session.activeExercise = true;
  }

  const configuration = await repositories.user.getConfiguration(userId);

  return (
    <ExerciseSession
      initialBlocks={blocks}
      session={session}
      hasDocument={!!session.documentId}
      configuration={configuration}
    />
  );
}

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { urlWithLocale } from '@/lib/actions/utils';
import { repositories } from '@/lib/repositories/repositories';
import { guardService } from '../services/guard-service';
import { sessionService } from '../services/session-service';

export async function deleteSession(formData: FormData): Promise<void> {
  const parsedFormData = z
    .object({
      sessionId: z.string(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsedFormData.success) {
    throw new Error('Invalid form data');
  }

  const sessionId = parsedFormData.data.sessionId;
  const userIsOwner = await guardService.userIsOwnerOfSession(sessionId);

  if (!userIsOwner) {
    throw new Error('Not exist');
  }

  await repositories.studySession.deleteSession(sessionId);

  const url = urlWithLocale('/app/sessions');

  revalidatePath(url);
}

export async function createSession(
  documentId: string,
  selectExercises: string[],
  language: string,
) {
  const userHasAccess = await guardService.userHasAccessToContentt(documentId);

  if (!userHasAccess) {
    return new Response(
      'Forbidden, you do not have access to all the documents',
      { status: 403 },
    );
  }

  const sessionId = await sessionService.createSession(
    documentId,
    selectExercises,
    language,
  );

  redirect(urlWithLocale(`/app/sessions/${sessionId}`));
}

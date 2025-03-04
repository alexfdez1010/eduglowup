'use server';

import { revalidatePath } from 'next/cache';

import { State } from '@/lib/interfaces';
import { z } from 'zod';
import { getDictionaryInActions, urlWithLocale } from '@/lib/actions/utils';
import { uploadDocumentService, UploadDocumentServiceResult } from '@/lib/services/upload-document-service';
import { uploadVideoService, UploadVideoServiceResult } from '@/lib/services/upload-video-service';
import { authProvider } from '@/lib/providers/auth-provider';
import { guardService } from '../services/guard-service';
import { generateContentService } from '@/lib/services/generate-content-service';
import { contentService } from '@/lib/services/content-service';
import { uploadAudioService, UploadAudioServiceResult } from '@/lib/services/upload-audio-service';

const uploadDocumentSchema = z.object({
  document: z.instanceof(File),
  courseId: z.string().uuid().optional(),
});

export async function uploadDocument(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const dictionary = getDictionaryInActions('content');

  const parsedFormData = uploadDocumentSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsedFormData.success) {
    return { isError: true, message: dictionary['error-no-file'] };
  }

  const file = parsedFormData.data.document;
  const courseId = parsedFormData.data.courseId;

  if (!uploadDocumentService.isValidExtension(file)) {
    return {
      isError: true,
      message: dictionary['error-file-type'],
    };
  }

  const userId = await authProvider.getUserId();

  const result = await uploadDocumentService.uploadDocument(
    userId,
    courseId,
    file,
  );

  if (result === UploadDocumentServiceResult.TOO_LONG) {
    return {
      isError: true,
      message: dictionary['file-too-long'],
    };
  }

  if (result === UploadDocumentServiceResult.TOO_SHORT) {
    return {
      isError: true,
      message: dictionary['file-too-short'],
    };
  }

  if (result === UploadDocumentServiceResult.ERROR) {
    return {
      isError: true,
      message: dictionary['error-file'],
    };
  }

  revalidatePath(`/app/courses/${courseId}`);
  return {
    isError: false,
    message: dictionary['file-uploaded'],
  };
}

const generateContentSchema = z.object({
  topic: z.string().min(1).max(60),
  description: z.string(),
  courseId: z.string().uuid().optional(),
});

export async function generateContent(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const dictionary = getDictionaryInActions('content');

  const parsedFormData = generateContentSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsedFormData.success) {
    return {
      isError: true,
      message: dictionary['error-no-topic'],
    };
  }

  const userId = await authProvider.getUserId();

  const { courseId, topic, description } = parsedFormData.data;

  const documentId = await generateContentService.generateContent(
    userId,
    topic,
    description,
    courseId,
  );

  if (!documentId) {
    return {
      isError: true,
      message: dictionary['error-generating-notes'],
    };
  }

  revalidatePath(`/app/courses/${courseId}`);
  return {
    isError: false,
    message: dictionary['notes-generated'],
  };
}

export async function deleteContent(_prevState: State, formData: FormData) {
  const contentId = formData.get('documentId') as string;

  await contentService.deleteContent(contentId);

  revalidatePath('/app/contents');
  revalidatePath('/app/courses/[id]');

  const dictionary = getDictionaryInActions('content');

  return { isError: false, message: dictionary['document-deleted'] };
}

const updateNameSchema = z.object({
  documentId: z.string(),
  name: z.string().min(1).max(80),
});

export async function updateNameDocument(
  _state: State,
  formData: FormData,
): Promise<State> {
  const dictionary = getDictionaryInActions('content');

  const formDataObject = updateNameSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!formDataObject.success) {
    console.error(formDataObject.error);
    throw new Error('Invalid form data');
  }

  const { documentId, name } = formDataObject.data;

  const isOwner = await guardService.userIsOwnerOfDocument(documentId);

  if (!isOwner) {
    throw new Error('Forbidden, you do not have access to the document');
  }

  await contentService.updateNameContent(documentId, name);

  revalidatePath(urlWithLocale('/app/'));
  return { isError: false, message: dictionary['name-updated'] };
}

const uploadVideoSchema = z.object({
  document: z.instanceof(File),
  courseId: z.string().uuid().optional(),
});

export async function uploadVideo(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const dictionary = getDictionaryInActions('content');

  const parsedFormData = uploadVideoSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsedFormData.success) {
    return { isError: true, message: dictionary['error-no-file'] };
  }

  const file = parsedFormData.data.document;
  const courseId = parsedFormData.data.courseId;

  if (!uploadVideoService.isValidVideoFormat(file)) {
    return {
      isError: true,
      message: dictionary['error-video-type'],
    };
  }

  const userId = await authProvider.getUserId();

  const result = await uploadVideoService.uploadVideo(userId, courseId, file);



  if(result === UploadVideoServiceResult.SUCCESS) {
    revalidatePath(`/app/courses/${courseId}`);
    return { isError: false, message: dictionary['success-upload-video'] };
  }else{
    switch(result){
      case UploadVideoServiceResult.TOO_LONG:
        return { isError: true, message: dictionary['video-too-long-error'] };
      case UploadVideoServiceResult.TOO_SHORT:
        return { isError: true, message: dictionary['video-too-short-error'] };
      case UploadVideoServiceResult.INVALID_FORMAT:
        return { isError: true, message: dictionary['video-format-error'] };
      default:
        return { isError: true, message: dictionary['video-upload-error'] };
    }
  }

}

const reuseContentSchema = z.object({
  courseId: z.string().uuid(),
  contentId: z.string().uuid(),
});

export async function reuseContent(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const dictionary = getDictionaryInActions('content');

  const result = reuseContentSchema.safeParse({
    courseId: formData.get('courseId'),
    contentId: formData.get('contentId'),
  });

  if (!result.success) {
    return { isError: true, message: dictionary['error-invalid-input'] };
  }

  const { courseId, contentId } = result.data;

  try {
    await contentService.addContentToCourse(contentId, courseId);
    revalidatePath(urlWithLocale(`/app/courses/${courseId}/contents`));
    return { isError: false, message: dictionary['success-reuse-content'] };
  } catch (error) {
    console.error('Error reusing content:', error);
    return { isError: true, message: dictionary['error-reuse-content'] };
  }
}

const uploadAudioSchema = z.object({
  document: z.instanceof(File),
  courseId: z.string().uuid().optional(),
});

export async function uploadAudio(
  _prevState : State,
  formData: FormData,
): Promise<State> {

  const dictionary = getDictionaryInActions('content');


  const parsedFormData = uploadVideoSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsedFormData.success) {
    return { isError: true, message: dictionary['error-no-file'] };
  }


  const file = parsedFormData.data.document;
  const courseId = parsedFormData.data.courseId;


  if (!uploadAudioService.isValidAudioFormat(file)) {

    return {
      isError: true,
      message: dictionary['audio-format-error'],
    };
  }

  const userId = await authProvider.getUserId();

  const result = await uploadAudioService.uploadAudio(userId, courseId, file);

  if(result === UploadAudioServiceResult.SUCCESS) {
    revalidatePath(`/app/courses/${courseId}`);
    return { isError: false, message: dictionary['success-upload-audio'] };
  }else{
    switch(result){
      case UploadAudioServiceResult.TOO_LONG:
        return { isError: true, message: dictionary['audio-too-long-error'] };
      case UploadAudioServiceResult.TOO_SHORT:
        return { isError: true, message: dictionary['audio-too-short-error'] };
      case UploadAudioServiceResult.INVALID_FORMAT:
        return { isError: true, message: dictionary['audio-format-error']};
      default:
        return { isError: true, message: dictionary['audio-upload-error'] };
    }
  }
}
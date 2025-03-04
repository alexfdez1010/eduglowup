'use client';

import { FileUpload } from '@/components/content/FileUpload';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { uploadVideo } from '@/lib/actions/content';
import HiddenInputCourseId from '@/components/content/HiddenInputCourseId';
import UploadVideoButton from '@/components/content/UploadVideoButton';
import { useDictionary } from '@/components/hooks';

export default function UploadVideo() {
  const dictionary = useDictionary('content');

  return (
    <FormWithFeedbackManagement
      className="flex flex-col justify-center items-center gap-3"
      action={uploadVideo}
      errorAsToast
    >
      <FileUpload accept="video/*" text={dictionary['upload-video']} />
      <HiddenInputCourseId />
      <UploadVideoButton />
    </FormWithFeedbackManagement>
  );
}

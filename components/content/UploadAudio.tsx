import { useDictionary } from '@/components/hooks';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { uploadAudio } from '@/lib/actions/content';
import { FileUpload } from '@/components/content/FileUpload';
import HiddenInputCourseId from '@/components/content/HiddenInputCourseId';
import UploadAudioButton from '@/components/content/UploadAudioButton';


export default function UploadAudio() {
  const dictionary = useDictionary('content');

  return (
    <FormWithFeedbackManagement
      className="flex flex-col justify-center items-center gap-3"
      action={uploadAudio}
      errorAsToast
    >
      <FileUpload accept=".mp3" text={dictionary['upload-audio']} />
      <HiddenInputCourseId />
      <UploadAudioButton />
    </FormWithFeedbackManagement>
  );
}
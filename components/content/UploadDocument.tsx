import { FileUpload } from '@/components/content/FileUpload';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { uploadDocument } from '@/lib/actions/content';
import UploadDocumentButton from '@/components/content/UploadDocumentButton';
import HiddenInputCourseId from '@/components/content/HiddenInputCourseId';

export default function UploadDocument() {
  return (
    <FormWithFeedbackManagement
      className="flex flex-col justify-center items-center gap-3"
      action={uploadDocument}
      errorAsToast
    >
      <FileUpload accept=".pdf,.epub,.doc,.pptx" />
      <HiddenInputCourseId />
      <UploadDocumentButton />
    </FormWithFeedbackManagement>
  );
}

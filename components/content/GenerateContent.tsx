import { useDictionary } from '@/components/hooks';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { generateContent } from '@/lib/actions/content';
import { Input } from '@nextui-org/react';
import { Textarea } from '@nextui-org/input';
import GenerateContentButton from '@/components/content/GenerateContentButton';
import HiddenInputCourseId from '@/components/content/HiddenInputCourseId';

export default function GenerateContent() {
  const dictionary = useDictionary('content');

  return (
    <FormWithFeedbackManagement
      className="flex flex-col justify-center items-center gap-5"
      action={generateContent}
      errorAsToast
    >
      <Input
        type="text"
        name="topic"
        label={dictionary['topic']}
        color="primary"
        variant="bordered"
        className="max-w-96"
        description={dictionary['topic-description']}
      />
      <Textarea
        className="max-w-96"
        variant="faded"
        color="primary"
        name="description"
        minRows={3}
        maxRows={15}
        maxLength={10000}
        label={dictionary['description']}
        description={dictionary['description-explanation']}
      />
      <HiddenInputCourseId />
      <GenerateContentButton />
    </FormWithFeedbackManagement>
  );
}

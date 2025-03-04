import { Textarea } from '@nextui-org/react';
import { useDictionary } from '@/components/hooks';

interface Props {
  description: string;
}

export default function Description({ description }: Props) {
  const dictionary = useDictionary('courses');

  return (
    <Textarea
      name="description"
      label={dictionary['course-description']}
      defaultValue={description ?? ''}
      placeholder={dictionary['course-description-placeholder']}
      color="primary"
      variant="faded"
      minRows={10}
      maxRows={30}
    />
  );
}

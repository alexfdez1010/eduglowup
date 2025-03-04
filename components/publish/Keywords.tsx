import {
  useKeywords,
  useKeywordsInCourse,
} from '@/components/publish/use-keywords';
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import ChipContainer from '@/components/general/ChipContainer';
import { useDictionary } from '@/components/hooks';

const maxKeywords = 5;

interface Props {
  keywordsCourse: string[];
}

export default function Keywords({ keywordsCourse }: Props) {
  const keywords = useKeywords();

  const [autoComplete, setAutoComplete] = useState<string>('');
  const { keywordInCourse, addKeyword, removeKeyword } =
    useKeywordsInCourse(keywordsCourse);

  const handlePress = () => {
    if (!keywordInCourse.includes(autoComplete)) {
      addKeyword(autoComplete);
    }
  };

  const dictionary = useDictionary('courses');

  const disabledButton =
    keywordInCourse.includes(autoComplete) ||
    keywordInCourse.length >= maxKeywords ||
    autoComplete === '';

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="flex flex-row items-center w-full">
        <input
          type="hidden"
          name="keywords"
          value={keywordInCourse.join('\n')}
        />
        <Autocomplete
          label={dictionary['keywords']}
          onInputChange={(value) => setAutoComplete(value)}
          value={autoComplete}
          allowsCustomValue
        >
          {keywords.map((keyword) => (
            <AutocompleteItem key={keyword}>{keyword}</AutocompleteItem>
          ))}
        </Autocomplete>
        <Button
          color={disabledButton ? 'default' : 'primary'}
          isIconOnly
          className="ml-2"
          onPress={handlePress}
          radius="full"
          isDisabled={disabledButton}
        >
          <Plus className="size-6 self-center" />
        </Button>
      </div>
      {keywordInCourse.length > 0 && (
        <ChipContainer
          color="primary"
          variant="bordered"
          items={keywordInCourse}
          removeFunction={removeKeyword}
        />
      )}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {dictionary['keywords-description']}
      </p>
    </div>
  );
}

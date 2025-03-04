import { Button, Tooltip } from '@nextui-org/react';
import { useDictionary, useUser } from '@/components/hooks';
import { DocumentDto } from '@/lib/dto/document.dto';
import { useState } from 'react';
import { createSession } from '@/lib/actions/sessions';
import { useExercises } from '@/components/content/use-exercises';
import { Play } from 'lucide-react';

interface StartSessionButtonProps {
  content: DocumentDto;
}

export function StartSessionButton({ content }: StartSessionButtonProps) {
  const [loading, setLoading] = useState(false);

  const dictionary = useDictionary('content');

  const { exercises } = useExercises();

  const handleCreateSession = async () => {
    setLoading(true);
    await createSession(content.id, Array.from(exercises), content.language);
    setLoading(false);
  };

  return (
    <Tooltip content={dictionary['start-session']} color="primary" showArrow>
      <Button
        color="primary"
        onPress={handleCreateSession}
        isLoading={loading}
        className="flex flex-row justify-center items-center"
        data-cy={`start-session-button-${content.id}`}
        aria-label={dictionary['start-session']}
        isIconOnly
        radius="full"
      >
        <Play className="size-6" />
      </Button>
    </Tooltip>
  );
}

import { Button } from '@nextui-org/react';
import { useDictionary } from '@/components/hooks';
import { DocumentDto } from '@/lib/dto/document.dto';
import { useState } from 'react';
import { createSession } from '@/lib/actions/sessions';
import { useExercises } from '@/components/content/use-exercises';

interface StartSessionButtonProps {
  document: DocumentDto;
}

export function StartSessionContentButton({
  document,
}: StartSessionButtonProps) {
  const [loading, setLoading] = useState(false);

  const dictionary = useDictionary('content');

  const { exercises } = useExercises();

  const handleCreateSession = async () => {
    setLoading(true);
    await createSession(document.id, Array.from(exercises), document.language);
    setLoading(false);
  };

  return (
    <Button
      color="primary"
      onPress={handleCreateSession}
      isLoading={loading}
      data-cy={`start-session-button-${document.id}`}
    >
      {dictionary['start-session']}
    </Button>
  );
}

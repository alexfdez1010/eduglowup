import { Button } from '@nextui-org/button';
import { useState } from 'react';
import { PressEvent } from '@react-types/shared';
import { errorToast } from '@/components/ToastContainerWrapper';
import { Tip, useTip } from '../general/Tip';
import { RewardDto } from '@/lib/reward/reward';
import { BlockDto } from '@/lib/dto/block.dto';
import { useDictionary } from '@/components/hooks';

interface ContinueButtonProps {
  sessionId: string;
  addBlock: (block: BlockDto) => void;
  incrementIndex: () => void;
}

export default function ContinueComponent({
  sessionId,
  addBlock,
  incrementIndex,
}: ContinueButtonProps) {
  const [pending, setPending] = useState(false);

  const dictionary = useDictionary('sessions');

  const handleSubmit = async (_event: PressEvent) => {
    setPending(true);
    incrementIndex();

    const formData = new FormData();
    formData.append('sessionId', sessionId);

    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { block } = await response.json();
        if (!block) {
          errorToast(dictionary['not-enough-diamonds-ask']);
          return;
        }
        addBlock(block);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      color="primary"
      isLoading={pending}
      onPress={handleSubmit}
      data-cy="continue-session-button"
    >
      {dictionary['next-exercise']}
    </Button>
  );
}

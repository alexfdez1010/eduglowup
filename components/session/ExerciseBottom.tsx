import React from 'react';
import { Button } from '@nextui-org/button';
import { PressEvent } from '@react-types/shared';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ExerciseBottomProps {
  canSubmit: boolean;
  loading: boolean;
  submit: () => Promise<void>;
  descriptionSubmit: string;
}

export function ExerciseBottom({
  canSubmit,
  loading,
  submit,
  descriptionSubmit,
}: ExerciseBottomProps) {
  return (
    <div className="self-center flex flex-row justify-center items-center gap-10 mb-2">
      <Button
        isDisabled={!canSubmit}
        isLoading={loading}
        onPress={submit}
        color={canSubmit ? 'primary' : 'default'}
        data-cy="submit-question-button"
      >
        {descriptionSubmit}
      </Button>
    </div>
  );
}

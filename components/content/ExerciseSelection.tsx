'use client';

import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { useDictionary } from '@/components/hooks';
import { useExercises } from '@/components/content/use-exercises';

interface ExerciseSelectionProps {
  exercisesNames: string[];
}

export function ExerciseSelection({ exercisesNames }: ExerciseSelectionProps) {
  const dictionary = useDictionary('content');

  const { exercises, updateExercises } = useExercises();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="primary" variant="ghost">
          {dictionary['select-exercises']}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={dictionary['select']}
        variant="bordered"
        color="primary"
        closeOnSelect={false}
        disallowEmptySelection
        selectionMode="multiple"
        selectedKeys={exercises}
        onSelectionChange={updateExercises}
      >
        {exercisesNames.map((exercise) => (
          <DropdownItem
            key={exercise}
            description={dictionary[`${exercise}-description`]}
          >
            {dictionary[exercise]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

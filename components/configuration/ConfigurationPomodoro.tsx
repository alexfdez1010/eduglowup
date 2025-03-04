import { updateConfiguration } from '@/lib/actions/configuration';
import FormWithFeedbackManagement from '../general/FormWithFeedbackManagement';
import ButtonWithSpinner from '../general/ButtonWithSpinner';
import { Slider, Switch } from '@nextui-org/react';
import { useState } from 'react';

interface ConfigurationPomodoroProps {
  usesPomodoro: boolean;
  minutesWork: number;
  minutesRest: number;
  localeDictionary: Record<string, string>;
}

export default function ConfigurationPomodoro({
  usesPomodoro,
  minutesWork,
  minutesRest,
  localeDictionary,
}: ConfigurationPomodoroProps) {
  const [pomodoroActive, setPomodoroActive] = useState(usesPomodoro);

  return (
    <FormWithFeedbackManagement
      action={updateConfiguration}
      className="space-y-10 flex flex-col justify-evenly items-center w-full"
    >
      <p className="text-sm font-bold text-center text-gray-500">
        {localeDictionary['pomodoro-description']}
      </p>
      <Switch
        isSelected={pomodoroActive}
        onValueChange={setPomodoroActive}
        data-cy="pomodoro-enabled"
      >
        {localeDictionary['pomodoro-enabled']}
      </Switch>
      <input type="hidden" name="usesPomodoro" value={`${pomodoroActive}`} />
      <Slider
        label={localeDictionary['pomodoro-work']}
        name="minutesWork"
        defaultValue={minutesWork}
        minValue={1}
        maxValue={60}
        isDisabled={!pomodoroActive}
        data-cy="pomodoro-work-time"
      />
      <Slider
        label={localeDictionary['pomodoro-rest']}
        name="minutesRest"
        defaultValue={minutesRest}
        minValue={1}
        maxValue={15}
        isDisabled={!pomodoroActive}
        data-cy="pomodoro-rest-time"
      />
      <ButtonWithSpinner className="mb-4" isActive={true} dataCy="submitButton">
        {localeDictionary['save']}
      </ButtonWithSpinner>
    </FormWithFeedbackManagement>
  );
}

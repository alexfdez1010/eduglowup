import { Play, Pause, RotateCcw, Minus, Plus } from 'lucide-react';
import { Button } from '@nextui-org/button';
import { useDictionary } from '@/components/hooks';
import { Card } from '@nextui-org/card';

interface PomodoroProps {
  isRest: boolean;
  sessionMinutes: number;
  restMinutes: number;
  isRunning: boolean;
  timeSeconds: number;
  continueSession: () => void;
  pauseSession: () => void;
  restartSession: () => void;
  incrementMinute: () => void;
  decrementMinute: () => void;
}

export default function Pomodoro({
  isRest,
  sessionMinutes,
  restMinutes,
  isRunning,
  timeSeconds,
  continueSession,
  pauseSession,
  restartSession,
  incrementMinute,
  decrementMinute,
}: PomodoroProps) {
  const [minutes, seconds] = [Math.floor(timeSeconds / 60), timeSeconds % 60];
  const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const icon = isRunning ? (
    <Pause className="size-6 text-white" />
  ) : (
    <Play className="size-6 text-white" />
  );

  const callback = isRunning ? pauseSession : continueSession;

  const maxSeconds = (isRest ? restMinutes : sessionMinutes) * 60;

  const calculateProgress = () => {
    const progress = (timeSeconds / maxSeconds) * 100;
    return Math.min(progress, 100);
  };

  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const dictionary = useDictionary('sessions');

  return (
    <Card className="w-11/12 md:w-[500px] h-48 flex flex-row p-4">
      <div className="relative w-36 h-36 mr-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="dark:text-black text-neutral-200 stroke-current"
            strokeWidth="8"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
          />
          <circle
            className="text-primary stroke-current"
            strokeWidth="8"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div
          data-cy="pomodoro-time"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl md:text-3xl font-bold text-primary"
        >
          {timeString}
        </div>
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <div className="text-primary text-lg font-semibold mb-2">Pomodoro</div>
        <div className="text-primary text-lg font-semibold mb-2">
          {(100 - progress).toFixed(0)}%{' '}
          {isRest
            ? dictionary['rest-completed']
            : dictionary['session-completed']}
        </div>
        <div className="flex justify-evenly">
          <Button
            onPress={decrementMinute}
            isIconOnly
            variant="ghost"
            color="primary"
            radius="full"
            aria-label={dictionary['pomodoro-decrease']}
          >
            <Minus className="size-6" />
          </Button>
          <Button
            onPress={incrementMinute}
            isIconOnly
            variant="ghost"
            color="primary"
            radius="full"
            aria-label={dictionary['pomodoro-increase']}
          >
            <Plus className="size-6" />
          </Button>
          <Button
            onPress={callback}
            isIconOnly
            variant="solid"
            color="primary"
            radius="full"
            aria-label={dictionary['pomodoro-pause']}
          >
            {icon}
          </Button>
          <Button
            onPress={restartSession}
            isIconOnly
            variant="solid"
            color="primary"
            radius="full"
            aria-label={dictionary['pomodoro-restart']}
          >
            <RotateCcw className="size-6" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

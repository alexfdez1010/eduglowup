import { usePomodoroTimer } from '@/components/session/hooks';
import Pomodoro from '@/components/session/Pomodoro';

export default function PomodoroExample() {
  const {
    isRest,
    isRunning,
    timeSeconds,
    continueSession,
    pauseSession,
    restartSession,
    incrementMinute,
    decrementMinute,
  } = usePomodoroTimer(25, 5, undefined, () => {}, true);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mt-5">
      <Pomodoro
        isRest={isRest}
        sessionMinutes={25}
        restMinutes={5}
        isRunning={isRunning}
        timeSeconds={timeSeconds}
        continueSession={continueSession}
        pauseSession={pauseSession}
        restartSession={restartSession}
        incrementMinute={incrementMinute}
        decrementMinute={decrementMinute}
      />
    </div>
  );
}

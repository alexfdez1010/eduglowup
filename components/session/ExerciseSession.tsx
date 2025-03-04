'use client';

import ContinueComponent from '@/components/session/ContinueComponent';
import BlockComponent from '@/components/session/BlockComponent';
import { useBlocks, usePomodoroTimer } from '@/components/session/hooks';
import { useEffect } from 'react';
import { BlockDto } from '@/lib/dto/block.dto';
import { StudySessionDto } from '@/lib/dto/study-session.dto';
import Pomodoro from '@/components/session/Pomodoro';
import { successToast } from '@/components/ToastContainerWrapper';
import { ConfigurationDto } from '@/lib/dto/configuration.dto';
import { useDictionary } from '@/components/hooks';
import { Pagination } from '@nextui-org/pagination';
import AskButton from '@/components/chat/AskButton';
import { Tip, useTip } from '@/components/general/Tip';
import { ExerciseDto } from '@/lib/dto/exercise.dto';

interface ExerciseSessionProps {
  initialBlocks: BlockDto[];
  session: StudySessionDto;
  hasDocument: boolean;
  configuration: ConfigurationDto;
}

export default function ExerciseSession({
  initialBlocks,
  session,
  hasDocument,
  configuration,
}: ExerciseSessionProps) {
  const {
    isExerciseActive,
    blocks,
    addBlock,
    finishExercise,
    index,
    setIndex,
    incrementIndex,
    numberOfPages,
  } = useBlocks({
    initialBlocks: initialBlocks,
    activeExerciseInitial: session.activeExercise,
  });

  const usesPomodoro = configuration.usesPomodoro;
  const sessionMinutes = configuration.minutesWork;
  const restMinutes = configuration.minutesRest;

  const sessionDictionary = useDictionary('sessions');

  const messageContinueSession = sessionDictionary['continue-session'].replace(
    '{minutes}',
    sessionMinutes.toString(),
  );

  const messageRest = sessionDictionary['rest-started'].replace(
    '{minutes}',
    restMinutes.toString(),
  );

  const continueCallback = () => {
    successToast(messageContinueSession);
  };

  const restCallback = () => {
    successToast(messageRest);
  };

  const {
    isRunning,
    isRest,
    timeSeconds,
    continueSession,
    pauseSession,
    restartSession,
    incrementMinute,
    decrementMinute,
  } = usePomodoroTimer(
    sessionMinutes,
    restMinutes,
    restCallback,
    continueCallback,
    usesPomodoro,
  );

  useEffect(() => {
    continueSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tip = useTip(session.language);
  const dictionary = useDictionary('sessions');

  return (
    <main className="flex flex-col justify-center items-center w-screen">
      <div className="mt-12 gap-5 flex flex-col justify-center items-center">
        {usesPomodoro && (
          <Pomodoro
            isRest={isRest}
            sessionMinutes={sessionMinutes}
            restMinutes={restMinutes}
            isRunning={isRunning}
            timeSeconds={timeSeconds}
            continueSession={continueSession}
            pauseSession={pauseSession}
            restartSession={restartSession}
            incrementMinute={incrementMinute}
            decrementMinute={decrementMinute}
          />
        )}
        <Pagination
          total={numberOfPages}
          loop
          page={index + 1}
          onChange={(newIndex) => setIndex(newIndex - 1)}
          showControls
          isCompact
          size="lg"
          className="w-full flex flex-row justify-center items-center"
        />
      </div>
      <div
        className="flex flex-col justify-start items-center gap-12 w-full md:w-[700px] mt-2 mb-28"
        data-cy="base-block-component"
      >
        {index >= blocks.length ? (
          <div className="flex flex-col justify-center items-center mt-12 w-11/12 md:w-[600px]">
            <Tip tip={tip} labelProgress={dictionary['creating-exercise']} />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center mt-12 w-11/12 md:w-[600px] gap-8">
            <BlockComponent
              block={blocks[index]}
              session={session}
              isActive={
                isExerciseActive &&
                blocks.length - 1 === index &&
                isRunning &&
                !isRest
              }
              hasFinishedExercise={
                !isExerciseActive || index !== blocks.length - 1
              }
              finishExam={finishExercise}
            />
            <div className="fixed bottom-[22.5%] right-[10%] md:right-[15%] lg:right-[20%] xl:right-[25%]">
              <AskButton
                isInPart={false}
                idForChat={session.id}
                documentId={session.documentId}
                order={(blocks[index].content as ExerciseDto).partOrder}
              />
            </div>
          </div>
        )}
        {!isExerciseActive && hasDocument && (
          <ContinueComponent
            sessionId={session.id}
            addBlock={addBlock}
            incrementIndex={incrementIndex}
          />
        )}
      </div>
    </main>
  );
}

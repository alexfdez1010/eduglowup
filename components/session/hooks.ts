import { useEffect, useReducer, useRef, useState, useCallback } from 'react';
import { BlockDto } from '@/lib/dto/block.dto';
import { RewardDto } from '@/lib/reward/reward';
import { useDictionary } from '@/components/hooks';
import { successToast } from '@/components/ToastContainerWrapper';
import launchConfetti from '@/components/session/confetti';

enum ActionType {
  ADD_BLOCK = 'ADD_BLOCK',
  UPDATE_LAST_BLOCK = 'UPDATE_LAST_BLOCK',
}

type Action =
  | { type: ActionType.ADD_BLOCK; payload: BlockDto }
  | { type: ActionType.UPDATE_LAST_BLOCK; payload: BlockDto };

interface UseBlocksProps {
  initialBlocks: BlockDto[];
  activeExerciseInitial: boolean;
}

function blocksReducer(blocks: BlockDto[], action: Action): BlockDto[] {
  switch (action.type) {
    case ActionType.ADD_BLOCK:
      return [...blocks, action.payload];
    case ActionType.UPDATE_LAST_BLOCK:
      return blocks.map((block) =>
        block.order === action.payload.order ? action.payload : block,
      );
    default:
      return blocks;
  }
}

/**
 * Hook to manage the blocks of the chat session
 * @param initialBlocks The initial blocks received from the server
 * @param activeExamInitial Whether the session has an active exercise initially
 *
 * @returns
 * - blocks: The current blocks
 * - currentBlock: The current block
 * - index: The index of the current block
 * - setIndex: Function to set the index of the current block
 * - isExerciseActive: Whether we are doing an exercise
 * - addBlock: Function to add a new block
 * - finishExercise: Function to finish the exam and update the last block
 * - incrementIndex: Function to increment the index of the current block
 */
export function useBlocks({
  initialBlocks,
  activeExerciseInitial,
}: UseBlocksProps) {
  const [blocks, dispatchBlocks] = useReducer(blocksReducer, initialBlocks);
  const [index, setIndex] = useState<number>(initialBlocks.length - 1);
  const [isExerciseActive, setIsExerciseActive] = useState<boolean>(
    activeExerciseInitial,
  );

  const [numberOfPages, setNumberOfPages] = useState<number>(
    initialBlocks.length,
  );

  const addBlock = useCallback((block: BlockDto) => {
    dispatchBlocks({ type: ActionType.ADD_BLOCK, payload: block });
    setIsExerciseActive(true);
  }, []);

  const finishExercise = useCallback((block: BlockDto) => {
    dispatchBlocks({ type: ActionType.UPDATE_LAST_BLOCK, payload: block });
    setIsExerciseActive(false);
  }, []);

  const incrementIndex = () => {
    setNumberOfPages(numberOfPages + 1);
    setIndex(index + 1);
  };

  return {
    blocks,
    index,
    setIndex,
    isExerciseActive,
    addBlock,
    finishExercise,
    incrementIndex,
    numberOfPages,
  };
}

/**
 * Hook to manage submission of an exercise
 *
 * @param apiPoint the endpoint to submit the exercise (POST)
 * @param finishExam function to finish the exam
 *
 * @returns
 * - loading: whether the submission is in progress
 * - handleSubmit: function to submit the exercise
 */
export function useSubmit(
  apiPoint: string,
  finishExam: (block: BlockDto) => void,
) {
  const [loading, setLoading] = useState<boolean>(false);

  const dictionary = useDictionary('sessions');

  const formatReward = (reward: RewardDto) => {
    return dictionary['reward-obtained'].replace(
      '{money}',
      reward.money.toString(),
    );
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      const response = await fetch(apiPoint, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { block, rewards } = await response.json();

        finishExam(block);

        if (rewards.length > 0) {
          launchConfetti();
          for (const reward of rewards) {
            successToast(formatReward(reward));
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit,
  };
}

/**
 * Hook to manage the pomodoro timer
 *
 * @param sessionMinutes the number of minutes the session is running
 * @param restMinutes the number of minutes the session is paused
 * @param restCallback function to call when the rest period ends
 * @param continueCallback function to call when the session is continued
 * @param active whether the pomodoro timer is active
 *
 * @returns
 * - isRunning: whether the session is running
 * - isRest: whether we are in the rest period
 * - timeSeconds: the number of seconds the session/rest period is running
 * - continueSession: function to start/continue the session
 * - pauseSession: function to pause the session
 * - restartSession: function to restart the session
 * - incrementMinute: function to increment the time by one minute
 * - decrementMinute: function to decrement the time by one minute
 */
export function usePomodoroTimer(
  sessionMinutes: number,
  restMinutes: number,
  restCallback?: () => void,
  continueCallback?: () => void,
  active: boolean = true,
) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRest, setIsRest] = useState<boolean>(false);
  const [timeSeconds, setTimeSeconds] = useState<number>(sessionMinutes * 60);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const continueSession = () => {
    setIsRunning(true);
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const restartSession = () => {
    setTimeSeconds(isRest ? restMinutes * 60 : sessionMinutes * 60);
  };

  const incrementMinute = () => {
    setTimeSeconds((prevTime) => prevTime + 60);
  };

  const decrementMinute = () => {
    setTimeSeconds((prevTime) => prevTime - 60);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeSeconds((prevTime) => prevTime - 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (!active) return;
    if (isRest && timeSeconds <= 0) {
      setIsRest(false);
      setTimeSeconds(sessionMinutes * 60);
      continueCallback && continueCallback();
    } else if (!isRest && timeSeconds <= 0) {
      setIsRest(true);
      setTimeSeconds(restMinutes * 60);
      restCallback && restCallback();
    }
  }, [
    timeSeconds,
    isRest,
    restMinutes,
    sessionMinutes,
    restCallback,
    continueCallback,
    active,
  ]);

  if (!active)
    return {
      isRunning: true,
      isRest: false,
      timeSeconds: 0,
      continueSession: () => {},
      pauseSession: () => {},
      restartSession,
    };

  return {
    isRunning,
    isRest,
    timeSeconds,
    continueSession,
    pauseSession,
    restartSession,
    incrementMinute,
    decrementMinute,
  };
}

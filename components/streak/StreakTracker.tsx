'use client';

import { motion } from 'framer-motion';
import { StreakWithLastWeekDto } from '@/lib/dto/streak.dto';
import { useDictionary } from '@/components/hooks';
import { Card } from '@nextui-org/card';
import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface StreakProps {
  streak: StreakWithLastWeekDto;
}

export default function StreakTracker({ streak }: StreakProps) {
  const getStreakStatus = () => {
    if (streak.lastWeekStreak[6]) return 'active';
    if (!streak.lastWeekStreak[5]) return 'inactive';
    return 'at-risk';
  };

  const streakStatus = getStreakStatus();

  const lastWeekCompleted = streak.lastWeekStreak.every((active) => active);

  const dictionary = useDictionary('streak');

  return (
    <Card className="p-4 rounded-lg shadow-md md:w-96 w-11/12">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{dictionary['title']}</h2>
        <div className="flex space-x-2">
          <div className="text-center">
            <p className="text-xl font-bold text-primary">
              {streak.currentStreak}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {dictionary['current']}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-success">
              {streak.longestStreak}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {dictionary['longest']}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-2">
        {streak.lastWeekStreak.map((active, index) => (
          <div key={index} className="flex flex-col items-center">
            {active ? (
              <CheckCircleIcon className="size-8 text-success" />
            ) : index === 6 ? (
              <QuestionMarkCircleIcon className="size-8 text-warning" />
            ) : (
              <XCircleIcon className="size-8 text-danger" />
            )}
            {index === 6 && (
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                {dictionary['today']}
              </span>
            )}
          </div>
        ))}
      </div>
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: streakStatus === 'at-risk' ? [1, 1.05, 1] : 1 }}
        transition={{
          duration: 0.5,
          repeat: streakStatus === 'at-risk' ? Infinity : 0,
          repeatType: 'reverse',
        }}
        className={`p-2 rounded-md text-center text-sm ${
          streakStatus === 'active'
            ? 'bg-green-200 text-green-800'
            : streakStatus === 'at-risk'
              ? 'bg-yellow-200 text-yellow-800'
              : 'bg-red-200 text-red-800'
        }`}
      >
        {streakStatus === 'active' &&
          lastWeekCompleted &&
          dictionary['perfect-week']}
        {streakStatus === 'active' &&
          !lastWeekCompleted &&
          dictionary['keep-it-up']}
        {streakStatus === 'at-risk' && dictionary['practice-today']}
        {streakStatus === 'inactive' && dictionary['start-a-streak']}
      </motion.div>
    </Card>
  );
}

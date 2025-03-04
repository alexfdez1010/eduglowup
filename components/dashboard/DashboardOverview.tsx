import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/statistics/Chart';
import { repositories } from '@/lib/repositories/repositories';
import { competitionService } from '@/lib/services/competition-service';
import { getCurrentWeek } from '@/lib/utils/date';

import NextLink from 'next/link';
import RegistrationChart from './RegistrationChart';
import Title from '../general/Title';

interface DashboardOverviewProps {
  locale: string;
  weekSelector: number;
}

export default async function DashboardOverview({
  locale,
  weekSelector,
}: DashboardOverviewProps) {
  const [
    totalUsers,
    time,
    totalExercises,
    totalInvitations,
    numberOfDocuments,
    exercisesByType,
    numberOfActiveUsers,
    numberOfFriends,
    registrations,
    numberOfCourses,
    numberofSignUpsInCourses,
  ] = await Promise.all([
    repositories.user.getNumberOfUsers(),
    repositories.dashboard.getTotalTimeOfUsers(),
    repositories.dashboard.getTotalExercises(),
    repositories.dashboard.getTotalNumberOfInvitations(),
    repositories.dashboard.getNumberOfDocuments(),
    repositories.dashboard.getNumberOfExercisesByType(),
    repositories.dashboard.getNumberOfActiveUsers(
      competitionService.getCurrentWeek(),
    ),
    repositories.dashboard.getNumberOfFriends(),
    repositories.dashboard.getAllDailyRegistrations(),
    repositories.dashboard.getNumberOfCourses(),
    repositories.dashboard.getNumberOfSignUpsInCourses(),
  ]);

  const chartData = dailyRegistrations(locale, weekSelector, registrations);

  const getMondayWeek = (offset: number) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    return new Date(
      currentDate.setDate(
        currentDate.getDate() -
          (currentDay === 0 ? 6 : currentDay - 1) +
          offset * 7,
      ),
    )
      .toISOString()
      .split('T')[0];
  };

  const totalTime = {
    days: Math.floor(time / 24),
    hours: time % 24,
  };

  const statCards: StatCard[] = [
    {
      title: 'Users',
      value: totalUsers,
    },
    {
      title: 'Time',
      value: `${totalTime.days}d ${totalTime.hours}h`,
    },
    {
      title: 'Exercises',
      value: totalExercises,
    },
    {
      title: 'Invitations',
      value: totalInvitations,
    },
    {
      title: 'Courses',
      value: numberOfCourses,
    },
    {
      title: 'Signups in courses',
      value: numberofSignUpsInCourses,
    },
    {
      title: 'Documents',
      value: numberOfDocuments,
    },
    {
      title: 'Short Questions',
      value: exercisesByType.SHORT || 0,
    },
    {
      title: 'Quiz',
      value: exercisesByType.QUIZ || 0,
    },
    {
      title: 'Concepts',
      value: exercisesByType.CONCEPT || 0,
    },
    {
      title: 'True or False',
      value: exercisesByType.TRUE_FALSE || 0,
    },
    {
      title: 'Flashcards',
      value: exercisesByType.FLASHCARDS || 0,
    },
    {
      title: 'Active users',
      value: numberOfActiveUsers,
    },
    {
      title: 'Friends',
      value: numberOfFriends,
    },
  ];

  return (
    <>
      <Title title="Dashboard" className="text-center mx-auto" />
      <div className="flex flex-wrap gap-4 w-full justify-center">
        {statCards.map((card, index) => (
          <StatisticCard key={index} title={card.title} value={card.value} />
        ))}
      </div>
      <div className="flex flex-row justify-evenly items-center w-full">
        <Button
          as={NextLink}
          href={`/dashboard?weekSelector=${weekSelector - 1}`}
          isIconOnly
          color="primary"
          radius="full"
        >
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div className="flex flex-col text-center">
          <h2 className="text-2xl font-bold">User registration by day</h2>
          <p className="text-lg font-semibold">{getMondayWeek(weekSelector)}</p>
        </div>
        <Button
          as={NextLink}
          href={`/dashboard?weekSelector=${weekSelector + 1}`}
          isIconOnly
          color="primary"
          radius="full"
        >
          <ArrowRightIcon className="size-5" />
        </Button>
      </div>
      <RegistrationChart chartData={chartData} />
    </>
  );
}

interface StatCard {
  title: string;
  value: string | number;
}

function StatisticCard({ title, value }: StatCard) {
  return (
    <div className="flex flex-col items-center px-2 py-4 rounded-xl bg-content2 shadow-sm w-40 h-24">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
}

export function dailyRegistrations(
  locale: string,
  weekSelector: number,
  registrations: { date: string; userCount: number }[],
) {
  const startingWeekDay = (offset = 0) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    return currentDate.setDate(
      currentDate.getDate() -
        (currentDay === 0 ? 6 : currentDay - 1) +
        offset * 7,
    );
  };

  const minusDays = (days: number) =>
    new Date(startingWeekDay(weekSelector) - days * 24 * 60 * 60 * 1000);

  const formattedDates = getCurrentWeek(weekSelector).map(
    (date) => date.toISOString().split('T')[0],
  );
  const filteredResults = formattedDates.map((date) => {
    const result = registrations.find((item) => item.date === date);
    return {
      date: date,
      userCount: result?.userCount ?? 0,
    };
  });

  const chartData = filteredResults.map((day, index) => ({
    date: minusDays(0 - index).toLocaleDateString(locale, {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    }),
    registrations: day.userCount,
  }));

  return chartData;
}

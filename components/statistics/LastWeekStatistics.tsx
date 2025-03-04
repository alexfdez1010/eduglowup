'use client';

import { GeneralStatisticsDto } from '@/lib/dto/statistics.dto';
import { useMemo, useState } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/statistics/Chart';
import { useDictionary } from '@/components/hooks';

interface LastWeekStatisticsProps {
  generalStatistics: GeneralStatisticsDto[];
}

const graphOptions = {
  flashcards: {
    correct: 'correctFlashcards',
    total: 'totalFlashcards',
  },
  quiz: {
    correct: 'correctQuizQuestions',
    total: 'totalQuizQuestions',
  },
  short: {
    correct: 'correctShortQuestions',
    total: 'totalShortQuestions',
  },
  'true-false': {
    correct: 'correctTrueFalseQuestions',
    total: 'totalTrueFalseQuestions',
  },
  concept: {
    correct: 'correctConceptQuestions',
    total: 'totalConceptQuestions',
  },
};

export default function LastWeekStatistics({
  generalStatistics,
}: LastWeekStatisticsProps) {
  const [selectGraph, setSelectGraph] = useState('quiz');

  const options = Object.keys(graphOptions);

  const dictionary = useDictionary('statistics');

  const sortStatistics = [...generalStatistics].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const getOnlyValueSelected = (selected: Set<string>) => {
    return Array.from(selected)[0];
  };

  const chartConfig: ChartConfig = {
    incorrect: {
      label: dictionary['incorrect'],
      color: 'hsl(var(--chart-incorrect))',
    },
    correct: {
      label: dictionary['correct'],
      color: 'hsl(var(--chart-correct))',
    },
  };

  const minusDays = (days: number) =>
    new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const chartData = useMemo(() => {
    const n = sortStatistics.length;
    return sortStatistics.map((item, index) => ({
      date: minusDays(n - index - 1).toLocaleDateString(),
      correct: item[graphOptions[selectGraph].correct],
      incorrect: item[graphOptions[selectGraph].total]
        ? item[graphOptions[selectGraph].total] -
          item[graphOptions[selectGraph].correct]
        : 0,
    }));
  }, [selectGraph, sortStatistics]);

  const pickDayAndMonth = (date: string) => {
    const [day, month, _year] = date.split('/');
    return `${day}/${month}`;
  };

  return (
    <div className="h-[450px] md:w-[600px] w-11/12">
      <div className="flex flex-row justify-between mb-4 items-center w-full">
        <h2 className="font-bold text-lg">
          {dictionary['last-week-statistics']}
        </h2>
        <Select
          color="primary"
          className="text-tiny"
          variant="bordered"
          label={dictionary['select-graph']}
          selectedKeys={new Set([selectGraph])}
          onSelectionChange={(value) =>
            setSelectGraph(getOnlyValueSelected(value as Set<string>))
          }
        >
          {options.map((option) => (
            <SelectItem key={option}>{dictionary[option]}</SelectItem>
          ))}
        </Select>
      </div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => pickDayAndMonth(value)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel className="w-24" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="incorrect"
            stackId="a"
            fill="var(--color-incorrect)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="correct"
            stackId="a"
            fill="var(--color-correct)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

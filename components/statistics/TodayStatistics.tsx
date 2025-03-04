'use client';

import { GeneralStatisticsDto } from '@/lib/dto/statistics.dto';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/statistics/Chart';
import { useDictionary } from '@/components/hooks';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';

interface TodayStatisticsProps {
  generalStatistics: GeneralStatisticsDto;
}

export function RadarChartStatistics({
  generalStatistics,
}: TodayStatisticsProps) {
  const dictionary = useDictionary('statistics');

  const chartData = [
    {
      label: dictionary['true-false'],
      total: generalStatistics.totalTrueFalseQuestions,
      correct: generalStatistics.correctTrueFalseQuestions,
    },
    {
      label: dictionary['quiz'],
      total: generalStatistics.totalQuizQuestions,
      correct: generalStatistics.correctQuizQuestions,
    },
    {
      label: dictionary['flashcards'],
      total: generalStatistics.totalFlashcards,
      correct: generalStatistics.correctFlashcards,
    },
    {
      label: dictionary['concept'],
      total: generalStatistics.totalConceptQuestions,
      correct: generalStatistics.correctConceptQuestions,
    },
    {
      label: dictionary['short'],
      total: generalStatistics.totalShortQuestions,
      correct: generalStatistics.correctShortQuestions,
    },
  ];

  const chartConfig = {
    correct: {
      label: dictionary['correct'],
      color: 'hsl(var(--chart-correct))',
    },
    total: {
      label: dictionary['total'],
      color: 'hsl(var(--chart-total))',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <RadarChart data={chartData} accessibilityLayer>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarGrid gridType="circle" radialLines={false} />
        <PolarAngleAxis dataKey="label" />
        <PolarRadiusAxis />
        <Radar
          dataKey="total"
          fill="var(--color-total)"
          fillOpacity={0.6}
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
        <Radar
          dataKey="correct"
          fill="var(--color-correct)"
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  );
}

export default function TodayStatistics({
  generalStatistics,
}: TodayStatisticsProps) {
  const dictionary = useDictionary('statistics');

  return (
    <div className="w-11/12 lg:w-[500px] xl:w-[600px] h-[450px] flex flex-col justify-evenly items-center gap-3 mb-4">
      <h2 className="font-bold text-2xl">{dictionary['today-statistics']}</h2>
      <RadarChartStatistics generalStatistics={generalStatistics} />
    </div>
  );
}

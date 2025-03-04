'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../statistics/Chart';

interface ChartData {
  chartData: {
    date: string;
    registrations: number;
  }[];
}

export default function RegistrationChart({ chartData }: ChartData) {
  return (
    <ChartContainer
      config={{
        value: {
          label: 'Value',
          color: 'hsl(var(--chart-1))',
        },
      }}
      className="w-full max-w-4xl flex flex-row justify-center items-center"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip
            content={<ChartTooltipContent />}
            contentStyle={{ backgroundColor: 'blue' }}
          />
          <Bar dataKey="registrations" fill="hsl(var(--registration-dot))" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

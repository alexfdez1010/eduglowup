'use client';

import CircularPercentage from '@/components/general/CircularPercentage';
import NextLink from 'next/link';
import { ItemStatistics } from '@/lib/dto/statistics.dto';

interface ListStatisticsProps {
  title: string;
  items: ItemStatistics[];
}

export default function ListStatistics({ title, items }: ListStatisticsProps) {
  const formatName = (name: string) => {
    return name.length <= 40 ? name : name.replace(/(.{40}).+/, '$1...');
  };

  return (
    <div className="w-11/12 lg:w-[500px] md:h-[450px] xl:w-[600px] flex flex-col justify-start items-center gap-8 mb-5">
      <h2 className="font-bold text-2xl">{title}</h2>
      <div className="flex flex-col gap-3 w-full">
        {items.map((item, index) =>
          item.link ? (
            <div
              key={index}
              className="flex flex-row justify-between items-center w-full"
            >
              <NextLink href={item.link} className="text-primary underline">
                {formatName(item.name)}
              </NextLink>
              <CircularPercentage value={item.progress * 100} size="lg" />
            </div>
          ) : (
            <div
              key={index}
              className="flex flex-row justify-between items-center w-full"
            >
              <p>{formatName(item.name)}</p>
              <CircularPercentage value={item.progress} size="lg" />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

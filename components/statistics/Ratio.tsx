import CircularPercentage from '@/components/general/CircularPercentage';

interface RatioProps {
  value: number;
  label: string;
}

export function Ratio({ value, label }: RatioProps) {
  return (
    <div className="size-24 flex flex-col justify-between items-center">
      <div className="row-span-2">
        <CircularPercentage value={value} size="md" />
      </div>
      <p className="m-4 font-semibold text-center text-xs">{label}</p>
    </div>
  );
}

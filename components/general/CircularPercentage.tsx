import { CircularProgress } from '@nextui-org/progress';

interface CircularWithColorsProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function CircularPercentage({
  value,
  size = 'md',
}: CircularWithColorsProps) {
  const color = value < 50 ? 'danger' : value < 80 ? 'warning' : 'success';

  return (
    <CircularProgress
      aria-label={`${value}%`}
      value={value}
      color={color}
      size={size}
      showValueLabel={true}
    />
  );
}

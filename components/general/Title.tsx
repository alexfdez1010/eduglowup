import { cn } from '@/components/utils';

interface TitleProps {
  title: string;
  className?: string;
}

export default function Title({ title, className }: TitleProps) {
  return (
    <h1 className={cn('text-4xl font-bold text-center', className)}>{title}</h1>
  );
}

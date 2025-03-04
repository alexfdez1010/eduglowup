import { cn } from '@/components/utils';
import { Star } from 'lucide-react';

export function Stars({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-center', className)}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

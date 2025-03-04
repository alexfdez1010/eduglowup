import { cn } from '@/components/utils';
import { Gem } from 'lucide-react';

interface ScoreProps {
  userCompetition: UserCompetitionDto;
  position: number;
  isSelf: boolean;
  diamonds?: number;
  className?: string;
}

export default function Score({
  userCompetition,
  position,
  isSelf,
  diamonds,
  className,
}: ScoreProps) {
  return (
    <div
      className={cn(
        'flex flex-row justify-between items-center',
        'w-11/12 max-w-2xl p-4 rounded-lg shadow-md',
        isSelf ? 'bg-primary/10 border-2 border-primary' : 'bg-secondary-900',
        className,
      )}
    >
      <div className="flex flex-row justify-center items-center gap-3">
        <span
          className={cn(
            'min-w-[2rem] font-bold text-lg',
            isSelf ? 'text-primary' : 'text-foreground',
          )}
        >
          {position}.
        </span>
        <div className="flex flex-col">
          <p
            className={cn(
              'font-bold text-lg',
              isSelf ? 'text-primary' : 'text-foreground',
            )}
          >
            {userCompetition.name.split(' ')[0]}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {diamonds && userCompetition.score > 0 && (
          <p className="text-sm font-semibold text-success flex flex-row items-baseline gap-0.5">
            <span>+{diamonds}</span>
            <Gem className="size-[10px]" />
          </p>
        )}
        <p
          className={cn(
            'font-bold text-lg',
            isSelf ? 'text-primary' : 'text-foreground',
          )}
        >
          {userCompetition.score}
        </p>
      </div>
    </div>
  );
}

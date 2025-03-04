import { RewardDto } from '@/lib/reward/reward';
import { Card, CardFooter, CardHeader } from '@nextui-org/card';
import { CardBody } from '@nextui-org/react';
import { useDictionary } from '@/components/hooks';
import { Progress } from '@nextui-org/progress';
import { Gem } from 'lucide-react';
import { cn } from '@/components/utils';

interface RewardCardProps {
  reward: RewardDto;
}

export default function RewardCard({ reward }: RewardCardProps) {
  const dictionary = useDictionary('rewards');

  const description = dictionary[reward.template]
    .replace('{money}', reward.money.toString())
    .replace('{goal}', reward.goal.toString())
    .replace('{documentName}', reward.documentName || '');

  return (
    <div className="aspect-square size-40">
      <Card
        className="p-1 aspect-square"
        isPressable
        fullWidth
        onPress={reward.action}
        shadow="sm"
      >
        <CardHeader className="flex flex-row justify-start items-center gap-1 text-primary">
          <h4 className="font-bold text-sm">{reward.money}</h4>
          <Gem className="size-3" />
        </CardHeader>
        <CardBody className="flex flex-col justify-center items-center">
          <p
            className={cn(
              'text-center',
              description.length > 60 ? 'text-[10px]' : 'text-xs',
            )}
          >
            {description}
          </p>
        </CardBody>
        <CardFooter>
          <Progress
            value={reward.progressPercentage}
            size="sm"
            color="primary"
            className="w-full"
            aria-label={reward.progressPercentage.toString()}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

'use client';

import { RewardDto } from '@/lib/reward/reward';
import RewardCard from '@/components/rewards/RewardCard';
import { useLaunchModal } from '@/components/modal/use-launch-modal';

interface RewardsProps {
  rewardsNotFulfilled: RewardDto[];
}

export default function Rewards({ rewardsNotFulfilled }: RewardsProps) {
  const launchModal = useLaunchModal();

  const invitationReward = rewardsNotFulfilled.find(
    (reward) => reward.template === 'invitation',
  );

  if (invitationReward) {
    invitationReward.action = () => {
      launchModal('invitation');
    };
  }

  return (
    <div className="flex flex-row justify-start items-center gap-4 overflow-x-auto w-full p-2">
      {rewardsNotFulfilled.map((reward, index) => (
        <RewardCard key={index} reward={reward} />
      ))}
    </div>
  );
}

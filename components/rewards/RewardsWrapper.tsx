import { rewardService } from '@/lib/services/reward-service';
import Rewards from '@/components/rewards/Rewards';
import {
  InvitationService,
  invitationService,
} from '@/lib/services/invitation-service';
import { authProvider } from '@/lib/providers/auth-provider';

export default async function RewardsWrapper() {
  const userId = await authProvider.getUserId();

  const [rewardsNotFulfilled, invitation] = await Promise.all([
    rewardService.getRewardsNotFulfilled(),
    invitationService.getInvitationOfUser(userId),
  ]);

  if (
    invitation &&
    invitation.invitationCount < InvitationService.maximumInvitations
  ) {
    rewardsNotFulfilled.push({
      progressPercentage:
        (invitation.invitationCount - InvitationService.maximumInvitations) *
        100,
      template: 'invitation',
      money:
        (InvitationService.maximumInvitations - invitation.invitationCount) *
        50,
      goal: InvitationService.maximumInvitations - invitation.invitationCount,
    });
  }

  rewardsNotFulfilled.sort((a, b) => b.money - a.money);

  return <Rewards rewardsNotFulfilled={rewardsNotFulfilled} />;
}

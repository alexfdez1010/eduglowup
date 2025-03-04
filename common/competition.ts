export const REWARDS_GENERAL = [100, 50, 25];

export const MIN_NUMBER_OF_FRIENDS = 1;

export const computeRewardsFriends = (numberOfFriends: number) => {
  if (numberOfFriends < MIN_NUMBER_OF_FRIENDS) {
    return [];
  }

  return [
    15 + 3 * (numberOfFriends - MIN_NUMBER_OF_FRIENDS),
    10 + 2 * (numberOfFriends - MIN_NUMBER_OF_FRIENDS),
    5 + numberOfFriends - MIN_NUMBER_OF_FRIENDS,
  ];
};

import {
  computeRewardsFriends,
  MIN_NUMBER_OF_FRIENDS,
} from '@/common/competition';
import Competition from '@/components/competition/Competition';
import FriendManagement from '@/components/competition/FriendManagement';
import { useDictionary } from '@/components/hooks';

interface FriendsCompetitionProps {
  friendScores: UserCompetitionDto[];
  selfScore: UserCompetitionDto;
  friendCode: string;
}

export default function FriendsCompetition({
  friendScores,
  selfScore,
  friendCode,
}: FriendsCompetitionProps) {
  const rewards = computeRewardsFriends(friendScores.length);

  const dictionary = useDictionary('competition');

  return (
    <div className="flex flex-col justify-center items-center w-screen h-full gap-5">
      <FriendManagement friendCode={friendCode} />
      {friendScores.length >= MIN_NUMBER_OF_FRIENDS ? (
        <Competition
          scores={friendScores}
          selfScore={selfScore}
          rewards={rewards}
        />
      ) : (
        <p className="text-center text-xl mt-12 max-w-lg">
          {dictionary['no-friends'].replace(
            '{number}',
            MIN_NUMBER_OF_FRIENDS.toString(),
          )}
        </p>
      )}
    </div>
  );
}

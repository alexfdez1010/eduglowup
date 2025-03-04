import { REWARDS_GENERAL } from '@/common/competition';
import Competition from '@/components/competition/Competition';

interface GeneralCompetitionProps {
  generalScores: UserCompetitionDto[];
  selfScore: UserCompetitionDto;
}

export default function GeneralCompetition({
  generalScores,
  selfScore,
}: GeneralCompetitionProps) {
  return (
    <Competition
      scores={generalScores}
      selfScore={selfScore}
      rewards={REWARDS_GENERAL}
    />
  );
}

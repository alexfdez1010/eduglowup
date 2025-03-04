import Score from '@/components/competition/Score';

export interface CompetitionProps {
  scores: UserCompetitionDto[];
  selfScore: UserCompetitionDto;
  rewards: number[];
}

export default function Competition({
  scores,
  selfScore,
  rewards,
}: CompetitionProps) {
  const scoresToShow = scores.slice(0, scores.length);

  const isSelfInsideClassification =
    Math.min(...scores.map((score) => score.score)) <= selfScore.score;

  if (
    isSelfInsideClassification &&
    !scores.find((score) => score.userId === selfScore.userId)
  ) {
    scoresToShow.push(selfScore);
  }

  scoresToShow.sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col justify-center items-center w-screen h-full gap-3">
      {!isSelfInsideClassification && (
        <Score
          userCompetition={selfScore}
          position={scores.length + 1}
          isSelf={true}
          className="mb-8"
        />
      )}
      {scoresToShow.map((score, index) => (
        <Score
          key={score.userId}
          userCompetition={score}
          position={index + 1}
          isSelf={score.userId === selfScore.userId}
          diamonds={rewards[index]}
        />
      ))}
    </div>
  );
}

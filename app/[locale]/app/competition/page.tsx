import { LocalePageProps } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { competitionService } from '@/lib/services/competition-service';
import Title from '@/components/general/Title';
import TabsCompetition from '@/components/competition/TabsCompetition';

export default async function Page({ params }: LocalePageProps) {
  const dictionary = getDictionary(params.locale)['competition'];

  const [generalScores, friendScores, selfScore, friendCode] =
    await Promise.all([
      competitionService.getTopGeneralScores(),
      competitionService.getTopFriendScores(),
      competitionService.getSelfScore(),
      competitionService.getFriendCode(),
    ]);

  return (
    <>
      <Title title={dictionary['title']} />
      <TabsCompetition
        generalScores={generalScores}
        friendScores={friendScores}
        selfScore={selfScore}
        friendCode={friendCode}
      />
    </>
  );
}

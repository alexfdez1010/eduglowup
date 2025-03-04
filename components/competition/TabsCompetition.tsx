'use client';

import { Tab, Tabs } from '@nextui-org/react';
import { useDictionary } from '@/components/hooks';
import FriendsCompetition from '@/components/competition/FriendsCompetition';
import GeneralCompetition from '@/components/competition/GeneralCompetition';

interface TabsCompetitionProps {
  generalScores: UserCompetitionDto[];
  friendScores: UserCompetitionDto[];
  selfScore: UserCompetitionDto;
  friendCode: string;
}

export default function TabsCompetition({
  generalScores,
  friendScores,
  selfScore,
  friendCode,
}: TabsCompetitionProps) {
  const dictionary = useDictionary('competition');

  return (
    <Tabs
      size="lg"
      aria-label={dictionary['title']}
      color="primary"
      variant="bordered"
    >
      <Tab key="general" title={dictionary['general']}>
        <GeneralCompetition
          generalScores={generalScores}
          selfScore={selfScore}
        />
      </Tab>
      <Tab key="friends" title={dictionary['friends']}>
        <FriendsCompetition
          friendScores={friendScores}
          selfScore={selfScore}
          friendCode={friendCode}
        />
      </Tab>
    </Tabs>
  );
}

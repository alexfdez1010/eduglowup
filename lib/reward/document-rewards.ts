import { TemplateReward } from '@/lib/reward/template';

export const documentRewards: TemplateReward[] = [
  {
    money: '5 - 10',
    goal: '20 - 50',
    type: 'DocumentCorrect',
  },
  {
    money: '2 - 8',
    goal: '20 - 50',
    type: 'DocumentTotal',
  },
  {
    money: '15 - 25',
    goal: '150 - 250',
    type: 'DocumentCorrect | DocumentTotal',
  },
];

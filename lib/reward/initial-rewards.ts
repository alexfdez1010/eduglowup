import { TemplateReward } from '@/lib/reward/template';

export const initialRewards: TemplateReward[] = [
  {
    money: '100',
    goal: '1000',
    type: 'UserCorrect',
  },
  {
    money: '10',
    goal: '10',
    type: 'UserCorrect | UserTotal',
  },
  {
    money: '5 - 10',
    goal: '1',
    type: 'FirstExercise',
  },
  {
    money: '5 - 15',
    goal: '1',
    type: 'FirstQuiz | FirstTrueFalse',
  },
  {
    money: '15 - 30',
    goal: '1',
    type: 'AllCorrectQuiz | AllCorrectConcepts',
  },
];

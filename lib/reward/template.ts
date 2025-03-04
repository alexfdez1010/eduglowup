import { Reward } from '@/lib/reward/reward';
import { randomElement, randomInt } from '@/lib/random';
import { UserCorrectReward, UserTotalReward } from '@/lib/reward/reward-user';
import {
  DocumentCorrectReward,
  DocumentTotalReward,
} from '@/lib/reward/reward-document';
import {
  FirstExerciseReward,
  FirstQuizReward,
  FirstTrueFalseReward,
  AllCorrectQuizReward,
  AllCorrectConceptsReward,
} from '@/lib/reward/reward-exercise';
import { UUID } from '@/lib/uuid';

export interface TemplateReward {
  money: string;
  goal: string;
  type: string;
}

export function templatesToRewards(templates: TemplateReward[]): Reward[] {
  return templates.map((template) => templateToReward(template));
}

export function templateToReward(template: TemplateReward): Reward {
  let type: string;
  let money: number;
  let goal: number;

  if (template.type.split('|').length > 1) {
    const types = template.type.split('|').map((type) => type.trim());
    type = randomElement(types);
  } else {
    type = template.type;
  }

  if (template.money.split('-').length > 1) {
    const [min, max] = template.money
      .split('-')
      .map((value) => parseInt(value));
    money = randomInt(min, max);
  } else {
    money = parseInt(template.money);
  }

  if (template.goal.split('-').length > 1) {
    const [min, max] = template.goal.split('-').map((value) => parseInt(value));
    goal = randomInt(min, max);
  } else {
    goal = parseInt(template.goal);
  }

  const RewardClass = getRewardClass(type);

  return new RewardClass(UUID.generate(), money, goal, undefined);
}

function getRewardClass(type: string) {
  switch (type) {
    case 'DocumentCorrect':
      return DocumentCorrectReward;
    case 'DocumentTotal':
      return DocumentTotalReward;
    case 'FirstExercise':
      return FirstExerciseReward;
    case 'FirstQuiz':
      return FirstQuizReward;
    case 'FirstTrueFalse':
      return FirstTrueFalseReward;
    case 'AllCorrectQuiz':
      return AllCorrectQuizReward;
    case 'AllCorrectConcepts':
      return AllCorrectConceptsReward;
    case 'UserCorrect':
      return UserCorrectReward;
    case 'UserTotal':
      return UserTotalReward;
    default:
      throw new Error(`Unknown reward type: ${type}`);
  }
}

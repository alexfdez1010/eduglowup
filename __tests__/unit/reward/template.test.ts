import { describe, expect, it } from 'vitest';
import { templateToReward, templatesToRewards } from '@/lib/reward/template';
import { UserCorrectReward, UserTotalReward } from '@/lib/reward/reward-user';

describe('templateToReward', () => {
  it('should convert a simple template to a streak', () => {
    const template = {
      money: '100',
      goal: '1000',
      type: 'UserCorrect',
    };

    const reward = templateToReward(template);

    expect(reward).toBeInstanceOf(UserCorrectReward);
    expect(reward.getMoney()).toBe(100);
    expect(reward.getGoal()).toBe(1000);
  });

  it('should convert a template with a range to a streak', () => {
    const template = {
      money: '10 - 20',
      goal: '1 - 5',
      type: 'UserCorrect',
    };

    const reward = templateToReward(template);

    expect(reward).toBeInstanceOf(UserCorrectReward);
    expect(reward.getMoney()).toBeGreaterThanOrEqual(10);
    expect(reward.getMoney()).toBeLessThanOrEqual(20);
    expect(reward.getGoal()).toBeGreaterThanOrEqual(1);
    expect(reward.getGoal()).toBeLessThanOrEqual(5);
  });

  it('should convert a template with multiple types to a streak', () => {
    const template = {
      money: '10 - 20',
      goal: '1 - 5',
      type: 'UserCorrect | UserTotal',
    };

    const reward = templateToReward(template);

    expect(
      reward instanceof UserCorrectReward || reward instanceof UserTotalReward,
    ).toBe(true);
    expect(reward.getMoney()).toBeGreaterThanOrEqual(10);
    expect(reward.getMoney()).toBeLessThanOrEqual(20);
    expect(reward.getGoal()).toBeGreaterThanOrEqual(1);
    expect(reward.getGoal()).toBeLessThanOrEqual(5);
  });

  it('should throw an error if the template type is invalid', () => {
    const template = {
      money: '10 - 20',
      goal: '1 - 5',
      type: 'InvalidType',
    };

    expect(() => templateToReward(template)).toThrow(
      'Unknown reward type: InvalidType',
    );
  });
});

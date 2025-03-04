import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Reward } from '@/lib/reward/reward';
import { fakeInt, fakeUuid } from '@/__tests__/unit/fake';
import {
  AllCorrectConceptsRewardMother,
  AllCorrectQuizRewardMother,
  DocumentTotalRewardMother,
  FirstExerciseRewardMother,
  FirstQuizRewardMother,
  FirstTrueFalseRewardMother,
  ReportRewardMother,
  UserCorrectRewardMother,
  UserTotalRewardMother,
} from '@/__tests__/unit/object-mothers';
import { ExerciseType } from '@/lib/reward/report';

describe('Reward', () => {
  let id: string;
  let money: number;
  let goal: number;
  let documentId: string;
  let reward: Reward;

  beforeEach(() => {
    id = fakeUuid();
    money = fakeInt(10, 100);
    goal = 100;
    documentId = fakeUuid();
    reward = UserCorrectRewardMother.create({
      id,
      money,
      goal,
      documentId,
      progress: 0,
    });
  });

  describe('basic class functionality', () => {
    it('should return the correct id', () => {
      expect(reward.getId()).toBe(id);
    });

    it('should return the correct money', () => {
      expect(reward.getMoney()).toBe(money);
    });

    it('should return the correct goal', () => {
      expect(reward.getGoal()).toBe(goal);
    });

    it('should return the correct document id', () => {
      expect(reward.getDocumentId()).toBe(documentId);
    });

    it('should return the correct percentage progress', () => {
      (reward as any).goal = 100;
      expect(reward.getPercentageProgress()).toBe(0);

      (reward as any).progress = 10;

      expect(reward.getPercentageProgress()).toBe(10);

      (reward as any).progress = 50;

      expect(reward.getPercentageProgress()).toBe(50);

      (reward as any).progress = 100;

      expect(reward.getPercentageProgress()).toBe(100);
    });

    it('should return as maximum 100 the percentage progress', () => {
      (reward as any).goal = 100;
      (reward as any).progress = 200;

      expect(reward.getPercentageProgress()).toBe(100);
    });

    it('should isFulfilled return false if the progress is less than the goal', () => {
      (reward as any).goal = 100;
      (reward as any).progress = 99;

      expect(reward.isFulfilled()).toBe(false);
    });

    it('should isFulfilled return true if the progress is equal to the goal', () => {
      (reward as any).goal = 100;
      (reward as any).progress = 100;

      expect(reward.isFulfilled()).toBe(true);
    });

    it('should isFulfilled return true if the progress is greater than the goal', () => {
      (reward as any).goal = 100;
      (reward as any).progress = 101;

      expect(reward.isFulfilled()).toBe(true);
    });
  });

  describe('the different subclasses of streak should work correctly', () => {
    it('DocumentCorrectReward', () => {
      reward = UserCorrectRewardMother.create({
        id,
        money,
        goal,
        documentId,
        progress: 0,
      });
      let report = ReportRewardMother.create({
        documentId,
        totalQuestions: 10,
        correctQuestions: 5,
      });

      expect(reward.update(report)).toBe(true);
      expect(reward.getPercentageProgress()).toBe(5);

      reward = UserCorrectRewardMother.create({
        id,
        money,
        goal,
        documentId,
        progress: 0,
      });
      report = ReportRewardMother.create({
        documentId,
        totalQuestions: 10,
        correctQuestions: 0,
      });

      expect(reward.update(report)).toBe(false);
      expect(reward.getPercentageProgress()).toBe(0);
    });

    it('DocumentTotalReward', () => {
      const reward = DocumentTotalRewardMother.create({
        id,
        money,
        goal,
        documentId,
        progress: 0,
      });
      const report = ReportRewardMother.create({
        documentId,
        totalQuestions: 10,
        correctQuestions: 0,
      });
      expect(reward.update(report)).toBe(true);
      expect(reward.getPercentageProgress()).toBe(10);
    });

    it('FirstExerciseReward', () => {
      const reward = FirstExerciseRewardMother.create({
        id,
        money,
        goal,
        documentId,
        progress: 0,
      });
      const report = ReportRewardMother.create({
        documentId,
        totalQuestions: 0,
        correctQuestions: 0,
      });
      expect(reward.update(report)).toBe(true);
      expect(reward.getPercentageProgress()).toBe(100);
    });

    it('FirstQuizReward', () => {
      const reward = FirstQuizRewardMother.create({
        id,
        money,
        goal,
        documentId,
        progress: 0,
      });
      const report = ReportRewardMother.create({
        documentId,
        totalQuestions: 0,
        correctQuestions: 0,
        exerciseType: ExerciseType.QUIZ,
      });
      expect(reward.update(report)).toBe(true);
      expect(reward.getPercentageProgress()).toBe(100);
    });

    it('FirstTrueFalseReward', () => {
      const reward = FirstTrueFalseRewardMother.create({
        id,
        money,
        goal,
        documentId,
        progress: 0,
      });
      const report = ReportRewardMother.create({
        documentId,
        totalQuestions: 0,
        correctQuestions: 0,
        exerciseType: ExerciseType.TRUE_FALSE,
      });
      expect(reward.update(report)).toBe(true);
      expect(reward.getPercentageProgress()).toBe(100);
    });

    it('AllCorrectQuizReward', () => {
      const questionsNumber = fakeInt(1, 20);
      const reward = AllCorrectQuizRewardMother.create({
        id,
        money,
        goal,
        documentId,
        progress: 0,
      });
      const report = ReportRewardMother.create({
        documentId,
        totalQuestions: questionsNumber,
        correctQuestions: questionsNumber,
        exerciseType: ExerciseType.QUIZ,
      });
      expect(reward.update(report)).toBe(true);
      expect(reward.getPercentageProgress()).toBe(100);
    });

    it('AllCorrectConceptsReward', () => {
      const questionsNumber = fakeInt(1, 20);
      const reward = AllCorrectConceptsRewardMother.create({
        id,
        money,
        goal,
        documentId,
        progress: 0,
      });
      const report = ReportRewardMother.create({
        documentId,
        totalQuestions: questionsNumber,
        correctQuestions: questionsNumber,
        exerciseType: ExerciseType.CONCEPT,
      });
      expect(reward.update(report)).toBe(true);
      expect(reward.getPercentageProgress()).toBe(100);
    });

    it('UserCorrectReward', () => {
      reward = UserCorrectRewardMother.create({
        id,
        money,
        goal,
        documentId,
        progress: 0,
      });
      let report = ReportRewardMother.create({
        documentId: fakeUuid(),
        totalQuestions: 0,
        correctQuestions: 6,
        exerciseType: ExerciseType.QUIZ,
      });
      expect(reward.update(report)).toBe(true);
      expect(reward.getPercentageProgress()).toBe(6);

      report = ReportRewardMother.create({
        documentId: fakeUuid(),
        totalQuestions: 0,
        correctQuestions: 0,
        exerciseType: ExerciseType.QUIZ,
      });
      expect(reward.update(report)).toBe(false);
      expect(reward.getPercentageProgress()).toBe(6);
    });

    it('DocumentCorrectReward', () => {
      reward = UserTotalRewardMother.create({
        id,
        money,
        goal,
        documentId,
        progress: 0,
      });
      let report = ReportRewardMother.create({
        documentId,
        totalQuestions: 10,
        correctQuestions: 6,
        exerciseType: ExerciseType.QUIZ,
      });
      expect(reward.update(report)).toBe(true);
      expect(reward.getPercentageProgress()).toBe(10);
    });
  });
});

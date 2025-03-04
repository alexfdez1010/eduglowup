import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExercisesService } from '@/lib/services/exercises-service';
import { Exercise } from '@/lib/exercises/interface';

describe('ExercisesService', () => {
  let exercisesService: ExercisesService;
  let mockExercises: Exercise[];

  beforeEach(() => {
    mockExercises = [
      {
        getName: vi.fn().mockReturnValue('Quiz'),
      },
      {
        getName: vi.fn().mockReturnValue('TrueFalse'),
      },
      {
        getName: vi.fn().mockReturnValue('ShortQuestions'),
      },
      {
        getName: vi.fn().mockReturnValue('Concept'),
      },
    ] as unknown as Exercise[];

    exercisesService = new ExercisesService(mockExercises);
  });

  describe('getExercises', () => {
    it('should return all exercises', () => {
      const exercises = exercisesService.getExercises();
      expect(exercises).toEqual(mockExercises);
      expect(exercises.length).toBe(4);
    });
  });

  describe('getExerciseByName', () => {
    it('should return the correct exercise when given a valid name', () => {
      const quizExercise = exercisesService.getExerciseByName('Quiz');
      expect(quizExercise).toBe(mockExercises[0]);

      const trueFalseExercise = exercisesService.getExerciseByName('TrueFalse');
      expect(trueFalseExercise).toBe(mockExercises[1]);
    });

    it('should return undefined when given an invalid name', () => {
      const invalidExercise =
        exercisesService.getExerciseByName('InvalidExercise');
      expect(invalidExercise).toBeUndefined();
    });
  });

  describe('fromStrings', () => {
    it('should convert an array of exercise names to an array of Exercise objects', () => {
      const exerciseNames = ['Quiz', 'TrueFalse', 'ShortQuestions'];
      const exercises = exercisesService.fromStrings(exerciseNames);

      expect(exercises.length).toBe(3);
      expect(exercises[0]).toBe(mockExercises[0]);
      expect(exercises[1]).toBe(mockExercises[1]);
      expect(exercises[2]).toBe(mockExercises[2]);
    });

    it('should return an empty array when given an empty array', () => {
      const exercises = exercisesService.fromStrings([]);
      expect(exercises).toEqual([]);
    });

    it('should ignore invalid exercise names', () => {
      const exerciseNames = ['Quiz', 'InvalidExercise', 'TrueFalse'];
      const exercises = exercisesService.fromStrings(exerciseNames);

      expect(exercises.length).toBe(2);
      expect(exercises[0]).toBe(mockExercises[0]);
      expect(exercises[1]).toBe(mockExercises[1]);
    });
  });
});

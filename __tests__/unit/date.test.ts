import {
  dateToString,
  getDatesBetween,
  minusDays,
  stringToDate,
  todayString,
} from '@/lib/utils/date';
import { describe, expect, it } from 'vitest';

describe('dateUtils', () => {
  describe('dateToString', () => {
    it('should convert a Date object to a string in the format YYYY-MM-DD', () => {
      const date = new Date('2023-06-12T00:00:00Z');
      expect(dateToString(date)).toBe('2023-06-12');
    });

    it('should handle different time zones correctly', () => {
      const date = new Date('2024-06-12T23:59:59Z');
      expect(dateToString(date)).toBe('2024-06-12');
    });

    it('should handle leap years correctly', () => {
      const date = new Date('2020-02-29T12:00:00Z');
      expect(dateToString(date)).toBe('2020-02-29');
    });
  });

  describe('stringToDate', () => {
    it('should convert a string in the format YYYY-MM-DD to a Date object', () => {
      const dateString = '2023-06-12';
      const date = stringToDate(dateString);
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe('2023-06-12T00:00:00.000Z');
    });

    it('should handle invalid date strings by returning an invalid Date object', () => {
      const dateString = 'invalid-date';
      const date = stringToDate(dateString);
      expect(date.toString()).toBe('Invalid Date');
    });

    it('should handle different valid date strings correctly', () => {
      const dateString = '2024-06-12';
      const date = stringToDate(dateString);
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe('2024-06-12T00:00:00.000Z');
    });
  });

  describe('todayString', () => {
    it('should return the current date in the format YYYY-MM-DD', () => {
      const today = new Date();
      const expectedString = dateToString(today);
      expect(todayString()).toBe(expectedString);
    });
  });

  describe('globalTest', () => {
    it('making both functions should return the same date', () => {
      const today = todayString();
      expect(today).toBe(dateToString(stringToDate(today)));
    });

    it('should handle different time zones correctly', () => {
      const date = new Date('2024-06-12T23:59:59Z');
      expect(dateToString(date)).toBe('2024-06-12');
    });

    it('should handle leap years correctly', () => {
      const date = new Date('2020-02-29T12:00:00Z');
      expect(dateToString(date)).toBe('2020-02-29');
    });
  });

  describe('getDatesBetween', () => {
    it('should return an array of dates between two dates (inclusive)', () => {
      const startDate = '2023-10-10';
      const endDate = '2023-10-15';
      const dates = getDatesBetween(startDate, endDate);
      expect(dates).toEqual([
        '2023-10-10',
        '2023-10-11',
        '2023-10-12',
        '2023-10-13',
        '2023-10-14',
        '2023-10-15',
      ]);
    });

    it('should handle different time zones correctly (inclusive)', () => {
      const startDate = '2023-10-10T00:00:00Z';
      const endDate = '2023-10-15T00:00:00Z';
      const dates = getDatesBetween(startDate, endDate);
      expect(dates).toEqual([
        '2023-10-10',
        '2023-10-11',
        '2023-10-12',
        '2023-10-13',
        '2023-10-14',
        '2023-10-15',
      ]);
    });
  });
});

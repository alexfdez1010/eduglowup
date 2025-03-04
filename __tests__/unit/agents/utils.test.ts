// @ts-nocheck
import {
  removeMarkdown,
  retryIfNotFulfilled,
  tryWithFallback,
} from '@/lib/agents/utils';

import { describe, expect, it, vi } from 'vitest';

describe('removeMarkdown', () => {
  it('should remove asterisks', () => {
    expect(removeMarkdown('**bold text**')).toBe('bold text');
  });

  it('should remove hash symbols', () => {
    expect(removeMarkdown('# Heading')).toBe('Heading');
  });

  it('should handle mixed markdown', () => {
    expect(removeMarkdown('# **Mixed** markdown')).toBe('Mixed markdown');
  });

  it('should trim whitespace', () => {
    expect(removeMarkdown('  *trimmed*  ')).toBe('trimmed');
  });

  it('should return empty string for input with only markdown characters', () => {
    expect(removeMarkdown('***##')).toBe('');
  });
});

describe('tryWithFallback', () => {
  it('should return result immediately if condition is fulfilled', async () => {
    const fn = () => Promise.resolve(1);
    const condition = (result: number) => result === 1;
    const fallback = () => Promise.resolve(2);

    const result = await tryWithFallback(fn, condition, fallback);

    expect(result).toBe(1);
  });

  it('should retry until condition is fulfilled', async () => {
    let counter = 1;
    const fn = () => Promise.resolve(counter++);
    const condition = (result: number) => result === 3;
    const fallback = () => Promise.resolve(4);

    const result = await tryWithFallback(fn, condition, fallback);

    expect(result).toBe(3);
  });

  it('should use fallback if retries are exhausted', async () => {
    const fn = () => Promise.resolve(1);
    const condition = (result: number) => result === 2;
    const fallback = () => Promise.resolve(3);

    const result = await tryWithFallback(fn, condition, fallback, 2);

    expect(result).toBe(3);
  });
});

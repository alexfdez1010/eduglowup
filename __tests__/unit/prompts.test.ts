import { replaceParametersPrompt } from '@/lib/prompts/utils';
import { describe, expect, test } from 'vitest';

describe('replaceParametersPrompt', () => {
  test('replaces single string parameter', () => {
    const prompt = 'Hello, {name}!';
    const parameters = { name: 'Alice' };
    const result = replaceParametersPrompt(prompt, parameters);
    expect(result).toBe('Hello, Alice!');
  });

  test('replaces single number parameter', () => {
    const prompt = 'You have {count} new messages.';
    const parameters = { count: 5 };
    const result = replaceParametersPrompt(prompt, parameters);
    expect(result).toBe('You have 5 new messages.');
  });

  test('replaces multiple parameters', () => {
    const prompt = 'Hello, {name}. You have {count} new messages.';
    const parameters = { name: 'Bob', count: 3 };
    const result = replaceParametersPrompt(prompt, parameters);
    expect(result).toBe('Hello, Bob. You have 3 new messages.');
  });

  test('handles missing parameters gracefully', () => {
    const prompt = 'Hello, {name}.';
    const parameters = {};
    const result = replaceParametersPrompt(prompt, parameters);
    expect(result).toBe('Hello, {name}.');
  });

  test('handles extra parameters gracefully', () => {
    const prompt = 'Hello, {name}.';
    const parameters = { name: 'Charlie', extra: 'unused' };
    const result = replaceParametersPrompt(prompt, parameters);
    expect(result).toBe('Hello, Charlie.');
  });

  test('replaces multiple occurrences of the same parameter', () => {
    const prompt = '{greeting}, {name}. {greeting} again!';
    const parameters = { greeting: 'Hi', name: 'Dana' };
    const result = replaceParametersPrompt(prompt, parameters);
    expect(result).toBe('Hi, Dana. Hi again!');
  });

  test('handles parameters with numeric keys', () => {
    const prompt = 'This is parameter {0} and this is parameter {1}.';
    const parameters = { 0: 'first', 1: 'second' };
    const result = replaceParametersPrompt(prompt, parameters);
    expect(result).toBe(
      'This is parameter first and this is parameter second.',
    );
  });
});

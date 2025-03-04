import { agents } from '@/lib/agents/agents';
import { describe, expect, it } from 'vitest';
import { colonText } from './common';

const agentTypicalQuestionsTest = agents.typicalQuestions;

describe('generateTypicalQuestions', async () => {
  it('should generate typical questions in Spanish', async () => {
    const language = 'es';
    const questions = await agentTypicalQuestionsTest.generateTypicalQuestions(
      colonText,
      language,
    );

    console.debug(questions);

    expect(questions.length).toBe(15);
  });

  it('should generate typical questions in English', async () => {
    const language = 'en';
    const questions = await agentTypicalQuestionsTest.generateTypicalQuestions(
      colonText,
      language,
    );

    console.debug(questions);

    expect(questions.length).toBe(15);
  });
});

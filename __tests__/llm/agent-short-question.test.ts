import { agents } from '@/lib/agents/agents';
import { describe, expect, it, vi } from 'vitest';
import { colonText } from './common';
import { SectionMother } from '../unit/object-mothers';

const agentShortQuestion = agents.shortQuestions;

describe('AgentShortQuestionImpl', () => {
  it('should create a short question', async () => {
    const text = colonText;

    const question = await agentShortQuestion.createQuestions(text, 'en');

    console.debug(question);

    const questionSpanish = await agentShortQuestion.createQuestions(
      text,
      'es',
    );

    expect(questionSpanish).toBeTruthy();

    console.debug(questionSpanish);
  });
});

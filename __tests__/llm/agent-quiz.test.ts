import { agents } from '@/lib/agents/agents';
import { describe, it } from 'vitest';
import { colonText } from './common';

const agentQuiz = agents.quiz;

describe('AgentQuizImpl', () => {
  it('should create a quiz question in English', async () => {
    const text = colonText;

    const questions = await agentQuiz.createQuestions(text, 'en');

    console.debug(questions);
  });

  it('should create a quiz question in Spanish', async () => {
    const text = colonText;

    const questions = await agentQuiz.createQuestions(text, 'es');

    console.debug(questions);
  });
});

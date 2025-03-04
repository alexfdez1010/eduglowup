import { nietzscheText } from '@/__tests__/llm/common';
import { agents } from '@/lib/agents/agents';
import { describe, it } from 'vitest';

const agentFlashcards = agents.flashcards;

describe('AgentFlashcardsImpl', () => {
  it('should create a flashcards question in English', async () => {
    const questions = await agentFlashcards.createQuestions(
      nietzscheText,
      'en',
    );

    console.debug(questions);
  });

  it('should create a flashcards question in Spanish', async () => {
    const questions = await agentFlashcards.createQuestions(
      nietzscheText,
      'es',
    );

    console.debug(questions);
  });
});

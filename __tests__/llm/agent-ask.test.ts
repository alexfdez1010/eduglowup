import { agents } from '@/lib/agents/agents';
import { describe, expect, it } from 'vitest';
import { nietzscheText } from '@/__tests__/llm/common';

const agentAsk = agents.ask;

describe('AgentAskImpl', () => {
  it('should create a answer in English', async () => {
    const answer = await agentAsk.ask(
      [],
      'What is the meaning of life according to Nietzsche?',
      [nietzscheText],
      'en',
    );

    console.debug(answer);
  });

  it('should create a answer in Spanish', async () => {
    const answer = await agentAsk.ask(
      [],
      '¿Cuál es el significado de la vida según Nietzsche?',
      [nietzscheText],
      'es',
    );

    console.debug(answer);
  });
});

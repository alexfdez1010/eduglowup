import { agents } from '@/lib/agents/agents';
import { describe, expect, it } from 'vitest';
import { nietzscheText } from './common';

const agentConcepts = agents.concept;

describe('AgentConceptsImpl', () => {
  it('should create a list of concepts in English', async () => {
    const concepts = await agentConcepts.createQuestions(nietzscheText, 'en');

    expect(concepts).toBeTruthy();

    console.debug(concepts);
  });

  it('should generate a list of concepts in Spanish', async () => {
    const conceptsSpanish = await agentConcepts.createQuestions(
      nietzscheText,
      'es',
    );

    expect(conceptsSpanish).toBeTruthy();

    console.debug(conceptsSpanish);
  });
});

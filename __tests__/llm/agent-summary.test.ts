import { agents } from '@/lib/agents/agents';
import { describe, it, assert } from 'vitest';
import { nietzscheText } from './common';

const agentSummary = agents.summary;

describe('AgentSummaryImpl', () => {
  it('should create a summary in English', async () => {
    const title = 'The Philosophy of Friedrich Nietzsche';

    const summary = await agentSummary.generateSummary(
      title,
      nietzscheText,
      'en',
    );

    console.debug(summary);

    assert(summary.includes(`# ${title}`));
  });

  it('should create a summary in Spanish', async () => {
    const titleSpanish = 'La Filosofía de Friedrich Nietzsche';

    const summarySpanish = await agentSummary.generateSummary(
      titleSpanish,
      nietzscheText,
      'es',
    );

    assert(summarySpanish.includes(`# ${titleSpanish}`));

    console.debug(summarySpanish);
  });
});

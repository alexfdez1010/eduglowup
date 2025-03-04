import { agents } from '@/lib/agents/agents';
import { describe, it } from 'vitest';

const agentPredictLanguage = agents.predictLanguage;

describe('AgentPredictLanguageImpl', () => {
  it('should predict the language of the text', async () => {
    const text = 'Oratoria';
    const language = await agentPredictLanguage.predictLanguage(text);

    console.debug(language);
    const enText = 'Rhetoric';

    const enLanguage = await agentPredictLanguage.predictLanguage(enText);

    console.debug(enLanguage);
  });
});

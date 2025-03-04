import { ChatGroq } from '@langchain/groq';
import { describe, it } from 'vitest';

describe('Restricted APIs', () => {
  it('should not be restricted API keys', async () => {
    const groqApiKeys = process.env.GROQ_API_KEYS.split(',');

    for (const key of groqApiKeys) {
      const model = new ChatGroq({
        apiKey: key,
        maxRetries: 0,
        model: 'llama-3.2-3b-preview',
      });

      try {
        await model.invoke([
          {
            role: 'user',
            content: 'Hello',
          },
        ]);
      } catch (e) {
        console.log('The key is restricted', key);
      }
    }
  });
});

import { AgentSplitPartsImpl } from '@/lib/agents/agent-split-parts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { randomInt } from 'node:crypto';

describe('AgentSplitPartsImpl', () => {
  const llmMock = {
    generate: vi.fn(),
    chat: vi.fn(),
  };

  let agent: AgentSplitPartsImpl;

  beforeEach(() => {
    agent = new AgentSplitPartsImpl(llmMock);
  });

  describe('splitDocumentIntoParts', () => {
    it('should split document into parts correctly', async () => {
      const allText =
        'Section 1: Section 1 description\nSection 2: Section 2 description\nSection 3: Section 3 description';
      const language = 'en';
      const numberOfSections = 3;

      const generatedText =
        'Section 1: Section 1 description+\nSection 2: Section 2 description-\nSection 3: Section 3 description+';

      llmMock.generate.mockResolvedValueOnce(generatedText);

      const parts = await agent.splitDocumentIntoParts(
        allText,
        language,
        numberOfSections,
      );

      expect(parts).toEqual([
        {
          name: 'Section 1',
          description: 'Section 1 description',
          isUseful: true,
        },
        {
          name: 'Section 2',
          description: 'Section 2 description',
          isUseful: false,
        },
        {
          name: 'Section 3',
          description: 'Section 3 description',
          isUseful: true,
        },
      ]);
    });

    it('should handle text with fewer sections than specified', async () => {
      const allText =
        'Section 1: Section 1 description\nSection 2: Section 2 description';
      const language = 'en';
      const numberOfSections = 3;

      const generatedText =
        'Section 1: Section 1 description+\nSection 2: Section 2 description-';

      llmMock.generate.mockResolvedValueOnce(generatedText);

      const parts = await agent.splitDocumentIntoParts(
        allText,
        language,
        numberOfSections,
      );

      expect(parts).toEqual([
        {
          name: 'Section 1',
          description: 'Section 1 description',
          isUseful: true,
        },
        {
          name: 'Section 2',
          description: 'Section 2 description',
          isUseful: false,
        },
      ]);
    });

    it('random test where we test that the number of parts is less than the maximum and that there are no consecutive pairs of parts that are useful', async () => {
      const numberOfRandomTests = 100;

      const randomTextExecution = async () => {
        const numberOfSections = randomInt(10, 20);
        const sectionTexts = Array(numberOfSections)
          .fill('')
          .map((_, index) => `Section ${index + 1}`);
        const descriptions = Array(numberOfSections)
          .fill('')
          .map((_, index) => `Section ${index + 1} description`);
        const isUsefulSections = Array.from(
          { length: numberOfSections },
          () => Math.random() > 0.5,
        );

        const generatedText = sectionTexts
          .map(
            (section, index) =>
              `${section}: ${descriptions[index]}${isUsefulSections[index] ? '+' : '-'}`,
          )
          .join('\n');

        llmMock.generate.mockResolvedValueOnce(generatedText);

        const parts = await agent.splitDocumentIntoParts(
          sectionTexts.join('\n'),
          'en',
          numberOfSections,
        );
        expect(parts.length).toBeGreaterThan(0);

        // There should not be any consecutive pairs
        // of parts that are not useful
        for (let i = 0; i < parts.length - 1; i++) {
          if (!parts[i].isUseful) {
            expect(parts[i + 1].isUseful).toBe(true);
          }
        }

        // If the number of parts is higher that the maximum,
        // then there should not be any consecutive pairs of
        // parts that are useful
        if (parts.length > 15) {
          for (let i = 0; i < parts.length - 1; i++) {
            if (parts[i].isUseful) {
              expect(parts[i + 1].isUseful).toBe(false);
            }
          }
        }
      };

      for (let i = 0; i < numberOfRandomTests; i++) {
        await randomTextExecution();
      }
    });
  });
});

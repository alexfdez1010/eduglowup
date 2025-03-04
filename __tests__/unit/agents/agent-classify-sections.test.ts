import { AgentClassifySectionsImpl } from '@/lib/agents/agent-classify-sections';
import { PartDto } from '@/lib/dto/part.dto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { randomInt } from '@/lib/random';

const llmMock = {
  generate: vi.fn(),
  chat: vi.fn(),
};

describe('AgentClassifySectionsImpl', () => {
  let agent: AgentClassifySectionsImpl;

  beforeEach(() => {
    agent = new AgentClassifySectionsImpl(llmMock);
  });

  describe('classifySections', () => {
    it('should classify sections correctly', async () => {
      const parts: PartDto[] = [
        { id: '1', name: 'Part 1', order: 1 },
        { id: '2', name: 'Part 2', order: 2 },
      ];
      const sectionTexts = ['Section 1 text', 'Section 2 text'];
      const descriptions = ['Part 1 description', 'Part 2 description'];

      llmMock.generate.mockResolvedValueOnce('1');
      llmMock.generate.mockResolvedValueOnce('2');

      const result = await agent.classifySections(
        parts,
        descriptions,
        sectionTexts,
      );

      expect(result).toEqual([
        { text: 'Section 1 text', partId: '1' },
        { text: 'Section 2 text', partId: '2' },
      ]);
    });

    it('should handle empty sections and parts', async () => {
      const parts: PartDto[] = [];
      const sectionTexts: string[] = [];
      const descriptions: string[] = [];

      const result = await agent.classifySections(
        parts,
        descriptions,
        sectionTexts,
      );

      expect(result).toEqual([]);
    });
  });

  describe('classifySection', () => {
    it('should classify section using LLM', async () => {
      const sectionText = 'Section 1 text';
      const options = ['Option 1', 'Option 2'];

      llmMock.generate.mockResolvedValueOnce('1');

      const result = await (agent as any).classifySection(sectionText, options);

      expect(result).toBe('Option 1');
    });

    it('should throw an error if no options are available', async () => {
      await expect(
        (agent as any).classifySection('Section text', []),
      ).rejects.toThrow('No options available for classification.');
    });

    it('should return the only option if only one is available', async () => {
      const result = await (agent as any).classifySection('Section text', [
        'Only Option',
      ]);
      expect(result).toBe('Only Option');
    });

    it('should return the median option if LLM response is invalid', async () => {
      const sectionText = 'Section text';
      const options = ['Option 1', 'Option 2', 'Option 3'];

      llmMock.generate.mockResolvedValueOnce('Invalid Response');

      const result = await (agent as any).classifySection(sectionText, options);
      expect(result).toBe('Option 2');
    });
  });

  describe('binarySearchClassification', () => {
    it('should classify sections correctly using binary search algorithm', async () => {
      const sectionTexts = [
        'Section 1',
        'Section 2',
        'Section 3',
        'Section 4',
        'Section 5',
        'Section 6',
      ];
      const options = ['Part A', 'Part B', 'Part C'];
      const optionsSelected = Array(sectionTexts.length).fill('');

      // Mock the classifySection method to return predictable results
      (agent as any).classifySection = vi.fn((sectionText: string) => {
        switch (sectionText) {
          case 'Section 1':
            return 'Part A';
          case 'Section 2':
            return 'Part A';
          case 'Section 3':
            return 'Part A';
          case 'Section 4':
            return 'Part B';
          case 'Section 5':
            return 'Part B';
          case 'Section 6':
            return 'Part C';
          default:
            return 'Part B';
        }
      });

      // Accessing the private method using type assertion
      await (agent as any).binarySearchClassification(
        sectionTexts,
        options,
        0,
        sectionTexts.length - 1,
        optionsSelected,
      );

      // Expect optionsSelected to be modified as per the logic
      expect(optionsSelected).toEqual([
        'Part A',
        'Part A',
        'Part A',
        'Part B',
        'Part B',
        'Part C',
      ]);
    });

    it('should handle sections correctly with uneven distribution', async () => {
      const sectionTexts = ['Section 1', 'Section 2', 'Section 3', 'Section 4'];
      const options = ['Part A', 'Part B', 'Part C', 'Part D'];
      const optionsSelected = Array(options.length).fill('');

      // Mock the classifySection method to return predictable results
      (agent as any).classifySection = vi.fn((sectionText: string) => {
        if (sectionText === 'Section 1') return 'Part A';
        if (sectionText === 'Section 2') return 'Part B';
        if (sectionText === 'Section 3') return 'Part C';
        if (sectionText === 'Section 4') return 'Part D';
        return 'Part B'; // Default case
      });

      // Accessing the private method using type assertion
      await (agent as any).binarySearchClassification(
        sectionTexts,
        options,
        0,
        sectionTexts.length - 1,
        optionsSelected,
      );

      // Expect optionsSelected to be modified as per the logic
      expect(optionsSelected).toEqual(['Part A', 'Part B', 'Part C', 'Part D']);
    });

    it('should not classify if left index is greater than right index', async () => {
      const sectionTexts = ['Section 1', 'Section 2', 'Section 3'];
      const options = ['Part A', 'Part B', 'Part C'];
      const optionsSelected = Array(options.length).fill('');

      // Accessing the private method using type assertion
      await (agent as any).binarySearchClassification(
        sectionTexts,
        options,
        2,
        1,
        optionsSelected,
      );

      // Expect optionsSelected to remain unchanged
      expect(optionsSelected).toEqual(['', '', '']);
    });
  });
});

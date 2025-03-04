import { AgentSummaryImpl } from '@/lib/agents/agent-summary';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeLanguage, fakeName, fakeStringWithSpaces } from '../fake';
import { numberOfRetriesOnAgents } from '@/lib/agents/utils';

const llmMock = {
  generate: vi.fn(),
  chat: vi.fn(),
};

describe('AgentSummaryImpl', () => {
  let agentSummary: AgentSummaryImpl;

  beforeEach(() => {
    agentSummary = new AgentSummaryImpl(llmMock);
    vi.clearAllMocks();
  });

  describe('generateSummary', () => {
    it('should generate a summary correctly', async () => {
      const title = fakeName();
      const text = fakeStringWithSpaces(100, 8000);
      const language = fakeLanguage();

      const summary = `# ${title}\n\n## ${fakeName()}\n\n${fakeStringWithSpaces(20, 100)}`;

      llmMock.generate.mockResolvedValueOnce(summary);

      const result = await agentSummary.generateSummary(title, text, language);
      expect(result).toBe(summary);

      expect(llmMock.generate).toHaveBeenCalled();
    });

    it('should add the title to the summary if not already present', async () => {
      const title = fakeName();
      const text = fakeStringWithSpaces(100, 8000);
      const language = fakeLanguage();

      const summary = `## ${fakeName()}\n\n${fakeStringWithSpaces(
        20,
        100,
      )}\n\n### ${fakeName()}\n\n${fakeStringWithSpaces(20, 100)}`;

      llmMock.generate.mockResolvedValueOnce(summary);

      const result = await agentSummary.generateSummary(title, text, language);

      const expected = `# ${title}\n\n${summary}`;

      expect(result).toBe(expected);
    });

    it('should substitute the title in the summary if it is already present', async () => {
      const title = fakeName();
      const text = fakeStringWithSpaces(100, 8000);
      const language = fakeLanguage();

      const wrongTitle = fakeName();

      const summary = `# ${wrongTitle}\n\n${fakeStringWithSpaces(
        20,
        100,
      )}\n\n## ${fakeName()}\n\n${fakeStringWithSpaces(20, 100)}`;

      llmMock.generate.mockResolvedValueOnce(summary);

      const result = await agentSummary.generateSummary(title, text, language);

      const expected = summary.replace(wrongTitle, title);

      expect(result).toBe(expected);
    });

    it('should remove the text before the first markdown without title', async () => {
      const title = fakeName();
      const text = fakeStringWithSpaces(100, 8000);
      const language = fakeLanguage();

      const textBeforeMarkdown = `${fakeStringWithSpaces()}\n ${fakeStringWithSpaces()}`;
      const summaryWithoutLine = `${textBeforeMarkdown}## ${fakeName()}\n\n${fakeStringWithSpaces(
        20,
        100,
      )}\n\n### ${fakeName()}\n\n${fakeStringWithSpaces(20, 100)}`;

      const summaryWithLine = `${textBeforeMarkdown}\n## ${fakeName()}\n\n${fakeStringWithSpaces(
        20,
        100,
      )}\n\n### ${fakeName()}\n\n${fakeStringWithSpaces(20, 100)}`;

      const expectedWithoutLine = `# ${title}\n\n${summaryWithoutLine.replace(
        textBeforeMarkdown,
        '',
      )}`;

      llmMock.generate
        .mockResolvedValueOnce(summaryWithoutLine)
        .mockResolvedValueOnce(summaryWithLine);

      const resultWithoutLine = await agentSummary.generateSummary(
        title,
        text,
        language,
      );

      const expectedWithLine = `# ${title}\n\n${summaryWithLine.replace(
        `${textBeforeMarkdown}\n`,
        '',
      )}`;

      const resultWithLine = await agentSummary.generateSummary(
        title,
        text,
        language,
      );

      expect(resultWithoutLine).toBe(expectedWithoutLine);
      expect(resultWithLine).toBe(expectedWithLine);
    });

    it('should remove the text before the first markdown with title', async () => {
      const title = fakeName();
      const text = fakeStringWithSpaces(100, 8000);
      const language = fakeLanguage();

      const textBeforeMarkdown = `${fakeStringWithSpaces()}\n ${fakeStringWithSpaces()}`;
      const summaryWithoutLine = `${textBeforeMarkdown}# ${title}\n\n ## ${fakeName()}\n\n${fakeStringWithSpaces(
        20,
        100,
      )}\n\n### ${fakeName()}\n\n${fakeStringWithSpaces(20, 100)}`;

      const summaryWithLine = `${textBeforeMarkdown}\n# ${title}\n\n## ${fakeName()}\n\n${fakeStringWithSpaces(
        20,
        100,
      )}\n\n### ${fakeName()}\n\n${fakeStringWithSpaces(20, 100)}`;

      const expectedWithoutLine = summaryWithoutLine.replace(
        textBeforeMarkdown,
        '',
      );

      llmMock.generate
        .mockResolvedValueOnce(summaryWithoutLine)
        .mockResolvedValueOnce(summaryWithLine);

      const resultWithoutLine = await agentSummary.generateSummary(
        title,
        text,
        language,
      );

      const expectedWithLine = summaryWithLine.replace(
        `${textBeforeMarkdown}\n`,
        '',
      );

      const resultWithLine = await agentSummary.generateSummary(
        title,
        text,
        language,
      );

      expect(resultWithoutLine).toBe(expectedWithoutLine);
      expect(resultWithLine).toBe(expectedWithLine);
    });
  });

  describe('it should handle errors in the LLM', () => {
    it('should try as least 5 times to generate the summary', async () => {
      const title = fakeName();
      const text = fakeStringWithSpaces(100, 8000);
      const language = fakeLanguage();

      const textWithoutMarkdown = fakeStringWithSpaces(100, 8000);

      const summary = `# ${title}\n\n${fakeStringWithSpaces(
        20,
        100,
      )}\n\n### ${fakeName()}\n\n${fakeStringWithSpaces(20, 100)}`;

      for (let i = 0; i < numberOfRetriesOnAgents - 1; i++) {
        llmMock.generate.mockResolvedValueOnce(textWithoutMarkdown);
      }

      llmMock.generate.mockResolvedValueOnce(summary);

      const result = await agentSummary.generateSummary(title, text, language);

      expect(result).toBe(summary);
      expect(llmMock.generate).toHaveBeenCalledTimes(5);
    });

    it('should return the fallback summary if there are more than 5 retries', async () => {
      const title = fakeName();
      const text = fakeStringWithSpaces(100, 8000);
      const language = fakeLanguage();

      const textWithoutMarkdown = fakeStringWithSpaces(100, 8000);

      for (let i = 0; i < numberOfRetriesOnAgents; i++) {
        llmMock.generate.mockResolvedValueOnce(textWithoutMarkdown);
      }

      const result = await agentSummary.generateSummary(title, text, language);

      expect(result).toBeTruthy();
      expect(llmMock.generate).toHaveBeenCalledTimes(5);
    });
  });
});

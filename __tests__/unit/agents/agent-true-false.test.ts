import { AgentTrueFalseImpl } from '@/lib/agents/agent-true-false';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fakeArray,
  fakeLanguage,
  fakeName,
  fakeStringWithSpaces,
} from '../fake';
import { SectionMother } from '../object-mothers';
import { SectionDto } from '@/lib/dto/section.dto';

const llmMock = {
  generate: vi.fn(),
  chat: vi.fn(),
};

describe('AgentTrueFalseImpl', () => {
  let agent: AgentTrueFalseImpl;

  beforeEach(() => {
    agent = new AgentTrueFalseImpl(llmMock);
    vi.clearAllMocks();
  });

  describe('createQuestion', () => {
    it('should create a true/false questions', async () => {
      const mockLanguage = fakeLanguage();

      const mockGenerateQuestion = fakeArray(() => fakeName(), 10, 10).join(
        '\n',
      );

      llmMock.generate.mockResolvedValueOnce(mockGenerateQuestion);

      const result = await agent.createQuestions(
        fakeStringWithSpaces(),
        mockLanguage,
      );

      for (let i = 0; i < result.length; i++) {
        const shouldBe = i % 2 === 0;
        expect(result[i].question).toBeTruthy();
        expect(result[i].isTrue).toBe(shouldBe);
        expect(result[i].answer).toBe('no-answered');
      }

      expect(llmMock.generate).toHaveBeenCalledTimes(1);
    });
  });

  it('should remove markdown from the text', async () => {
    const agent = new AgentTrueFalseImpl(llmMock);

    const response = `## 1. **It is possible to answer the question?**
    2. **It is possible to answer the question?**
    3. **It is possible to answer the question?**
    4. **It is possible to answer the question?**
    5. **It is possible to answer the question?**
    6. **It is possible to answer the question?**
    7. **It is possible to answer the question?**
    8. **It is possible to answer the question?**
    9. **It is possible to answer the question?**
    10. *It is possible to answer the question?*`;
    const language = fakeLanguage();

    llmMock.generate.mockResolvedValueOnce(response);

    const questionText = await agent.createQuestions(
      fakeStringWithSpaces(),
      language,
    );

    for (let i = 0; i < questionText.length; i++) {
      const shouldBe = i % 2 === 0;
      expect(questionText[i].question).toBeTruthy();
      expect(questionText[i].isTrue).toBe(shouldBe);
      expect(questionText[i].answer).toBe('no-answered');
    }

    expect(llmMock.generate).toHaveBeenCalledTimes(1);
  });
});

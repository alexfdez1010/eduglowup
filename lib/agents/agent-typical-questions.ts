import { LLM } from '@/lib/LLM/interface';
import { replaceParametersPrompt } from '@/lib/prompts/utils';
import { tryWithFallback } from '@/lib/agents/utils';
import { AgentTypicalQuestions } from '@/lib/agents/interfaces';
import { typicalQuestionsPrompts } from '@/lib/prompts/typical-questions';

export class AgentTypicalQuestionsImpl implements AgentTypicalQuestions {
  private llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async generateTypicalQuestions(
    partSummary: string,
    language: string,
  ): Promise<string[]> {
    const maxTokens = 500;

    const [systemPrompt, userPrompt] = this.generatePrompts(
      language,
      partSummary,
    );

    const generateTypicalQuestions = async () => {
      const text = await this.llm.generate(systemPrompt, userPrompt, maxTokens);
      return this.parseTextToTypicalQuestions(text);
    };

    const fallbackTypicalQuestions = [];

    return await tryWithFallback(
      generateTypicalQuestions,
      (questions) => questions.length > 0,
      () => Promise.resolve(fallbackTypicalQuestions),
    );
  }

  private generatePrompts(language: string, partSummary: string): string[] {
    const systemPrompt = typicalQuestionsPrompts[language].system;
    const userPrompt = replaceParametersPrompt(
      typicalQuestionsPrompts[language].user,
      {
        partSummary,
      },
    );

    return [systemPrompt, userPrompt];
  }

  private parseTextToTypicalQuestions(text: string): string[] {
    return text
      .split('\n')
      .filter((line) => line)
      .map((line) => line.replace(/^\d+\.\s+/, '').trim());
  }
}

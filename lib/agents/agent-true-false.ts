import { TrueFalseQuestionDto } from '@/lib/dto/true-false.dto';
import { trueFalsePrompts } from '@/lib/prompts/true-false';
import { LLM } from '@/lib/LLM/interface';
import { replaceParametersPrompt } from '@/lib/prompts/utils';
import { removeMarkdown, tryWithFallback } from '@/lib/agents/utils';
import { UUID } from '@/lib/uuid';
import { AgentQuestion } from '@/lib/agents/interfaces';
import { line } from 'd3';

export class AgentTrueFalseImpl implements AgentQuestion<TrueFalseQuestionDto> {
  private llm: LLM;

  public static readonly maxCharactersInput = 20000;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async createQuestions(
    text: string,
    language: string,
  ): Promise<TrueFalseQuestionDto[]> {
    const [systemPrompt, userPrompt] = this.generatePrompts(language, text);

    const maxTokens = 1500;

    return await tryWithFallback(
      async () =>
        this.parseTextToQuestions(
          await this.llm.generate(systemPrompt, userPrompt, maxTokens),
        ),
      (questions) => questions.length > 0,
      () => Promise.resolve([]),
    );
  }

  private generatePrompts(language: string, text: string): [string, string] {
    const userPrompt = replaceParametersPrompt(
      trueFalsePrompts[language].user,
      { text: text.slice(0, AgentTrueFalseImpl.maxCharactersInput) },
    );

    return [trueFalsePrompts[language].system, userPrompt];
  }

  private parseTextToQuestions(text: string): TrueFalseQuestionDto[] {
    const lines = removeMarkdown(text).split(/\n+/);

    return lines.filter((line) => line.length > 0).map((line, index) => {
      const isTrue = index % 2 === 0;

      return {
        id: UUID.generate(),
        question: line,
        isTrue: isTrue,
        partId: '',
        answer: 'no-answered',
      };
    });
  }
}

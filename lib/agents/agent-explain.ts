import { AgentExplain } from '@/lib/agents/interfaces';
import { LLM } from '@/lib/LLM/interface';
import { explainPrompts } from '@/lib/prompts/explain';

export class AgentExplainImpl implements AgentExplain {
  private readonly llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async explain(
    questionText: string,
    section: string,
    language: string,
  ): Promise<string> {
    const [systemPrompt, userPrompt] = this.generatePrompts(
      questionText,
      section,
      language,
    );

    const maxTokens = 300;

    return await this.llm.generate(systemPrompt, userPrompt, maxTokens);
  }

  private generatePrompts(
    text: string,
    section: string,
    language: string,
  ): [string, string] {
    const systemPrompt = explainPrompts[language].system;
    const userPrompt = explainPrompts[language].user
      .replace('{question}', text)
      .replace('{section}', section);

    return [systemPrompt, userPrompt];
  }
}

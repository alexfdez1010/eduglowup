import { MessageDto } from '@/lib/dto/message.dto';
import { AgentAsk } from '@/lib/agents/interfaces';
import { LLM } from '@/lib/LLM/interface';
import { askPrompts } from '@/lib/prompts/ask';
import { replaceParametersPrompt } from '@/lib/prompts/utils';

export class AgentAskImpl implements AgentAsk {
  private readonly llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async ask(
    previousMessages: MessageDto[],
    text: string,
    sectionsRelated: string[],
    language: string,
  ): Promise<string> {
    const [systemPrompt, userPrompt] = this.generatePrompts(
      text,
      sectionsRelated,
      previousMessages,
      language,
    );

    const maxTokens = 500;

    return await this.llm.generate(systemPrompt, userPrompt, maxTokens);
  }

  private generatePrompts(
    text: string,
    sectionsRelated: string[],
    previousMessages: MessageDto[],
    language: string,
  ): [string, string] {
    const systemPrompt = askPrompts[language].system.replace(
      '{question}',
      text,
    );

    const userPrompt = replaceParametersPrompt(askPrompts[language].user, {
      sections: sectionsRelated.join('\n\n'),
      lastMessages: previousMessages.join('\n\n'),
      question: text,
    });

    return [systemPrompt, userPrompt];
  }
}

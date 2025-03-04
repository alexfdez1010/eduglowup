import { LLM } from '@/lib/LLM/interface';
import { AgentSummary } from '@/lib/agents/interfaces';
import { summaryPrompts } from '@/lib/prompts/summary';
import { replaceParametersPrompt } from '@/lib/prompts/utils';
import {
  checkHasMarkdownHeadings,
  normalizeLineBreaks,
  removeTextBeforeMarkdown,
  setTitle,
  tryWithFallback,
} from './utils';

export class AgentSummaryImpl implements AgentSummary {
  private llm: LLM;
  public static readonly maxCharactersInput = 25000;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async generateSummary(
    title: string,
    text: string,
    language: string,
  ): Promise<string> {
    let [systemPrompt, userPrompt] = this.generatePrompts(
      language,
      title,
      text,
    );

    const maxTokens = 1000;

    const generateSummary = async () => {
      const summary = await this.llm.generate(
        systemPrompt,
        userPrompt,
        maxTokens,
      );
      return this.parseTextToSummary(summary, title);
    };

    const fallbackSummary = this.fallbackSummary(title, language);

    return await tryWithFallback(
      generateSummary,
      (summary) => summary !== null,
      () => Promise.resolve(fallbackSummary),
    );
  }

  private generatePrompts(language: string, title: string, text: string) {
    const systemPrompt = summaryPrompts[language].system;
    const userPrompt = replaceParametersPrompt(summaryPrompts[language].user, {
      title,
      text: text.slice(0, AgentSummaryImpl.maxCharactersInput),
    });

    return [systemPrompt, userPrompt];
  }

  private parseTextToSummary(
    summaryText: string,
    title: string,
  ): string | null {
    if (!checkHasMarkdownHeadings(summaryText)) {
      return null;
    }

    return normalizeLineBreaks(
      setTitle(title, removeTextBeforeMarkdown(summaryText)),
    );
  }

  private fallbackSummary(title: string, language: string): string {
    const esFallback = `# ${title}\n\n No se pudo generar un resumen para la parte ${title}.`;
    const enFallback = `# ${title}\n\n Could not generate a summary for the part ${title}.`;

    return language === 'es' ? esFallback : enFallback;
  }
}

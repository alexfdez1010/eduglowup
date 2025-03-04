import { LLM } from '@/lib/LLM/interface';
import { AgentGenerateNotes } from '@/lib/agents/interfaces';
import { PartDto } from '@/lib/dto/part.dto';
import { Edge, Graph } from '@/lib/graph';
import { generateNotesPartPrompts } from '@/lib/prompts/generate-notes-part';
import { generateNotesSummaryPrompts } from '@/lib/prompts/generate-notes-summary';
import {
  checkHasMarkdownHeadings,
  normalizeLineBreaks,
  removeTextBeforeMarkdown,
  setTitle,
  tryWithFallback,
} from '@/lib/agents/utils';

export class AgentGenerateNotesImpl implements AgentGenerateNotes {
  private llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async getParts(
    topic: string,
    description: string,
    language: string,
  ): Promise<{ name: string; description: string }[]> {
    const systemPrompt = generateNotesPartPrompts[language].system;
    const userPrompt = generateNotesPartPrompts[language].user
      .replace('{topic}', topic)
      .replace('{description}', description);

    const text = await this.llm.generate(systemPrompt, userPrompt, 200);

    return this.parseTextToParts(text);
  }

  async parseTextToParts(
    text: string,
  ): Promise<{ name: string; description: string }[]> {
    const lines = text.split('\n');

    return lines
      .map((line) => line.replace(/^\d+\.\s/, '').trim())
      .map((line) => {
        const [name, description] = line.split(':');
        return { name, description };
      })
      .filter(({ name, description }) => name && description);
  }

  async generateSummary(
    topic: string,
    description: string,
    part: string,
    language: string,
  ): Promise<string> {
    const systemPrompt = generateNotesSummaryPrompts[language].system;
    const userPrompt = generateNotesSummaryPrompts[language].user
      .replace('{topic}', topic)
      .replace('{part}', part)
      .replace('{description}', description);

    const maxTokens = 1000;

    const generateSummary = async () => {
      const summary = await this.llm.generate(
        systemPrompt,
        userPrompt,
        maxTokens,
      );
      return this.parseTextToSummary(summary, part);
    };

    const fallbackSummary = this.fallbackSummary(part, language);

    return tryWithFallback(
      generateSummary,
      (summary) => summary !== null,
      () => Promise.resolve(fallbackSummary),
    );
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

  createGraph(parts: PartDto[]): Graph<PartDto> {
    const edges: Edge<PartDto>[] = parts.slice(0, -1).map((part, index) => {
      return {
        from: part,
        to: parts[index + 1],
      };
    });

    return new Graph(parts, edges);
  }

  private fallbackSummary(title: string, language: string): string {
    const esFallback = `# ${title}\n\n No se pudo generar un resumen para la parte ${title}.`;
    const enFallback = `# ${title}\n\n Could not generate a summary for the part ${title}.`;

    return language === 'es' ? esFallback : enFallback;
  }
}

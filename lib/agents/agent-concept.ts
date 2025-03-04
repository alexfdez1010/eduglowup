import { AgentQuestion } from '@/lib/agents/interfaces';
import { LLM } from '@/lib/LLM/interface';
import { ConceptDto } from '@/lib/dto/concept.dto';
import { conceptPrompts } from '@/lib/prompts/concept';
import { removeMarkdown, tryWithFallback } from './utils';
import { UUID } from '@/lib/uuid';

const maxCharactersInput = 30000;

export class AgentConceptImpl implements AgentQuestion<ConceptDto> {
  private readonly llm: LLM;
  public static readonly placeholder = '__________';

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async createQuestions(text: string, language: string): Promise<ConceptDto[]> {
    const [systemPrompt, userPrompt] = this.generatePrompts(language, text);

    const maxTokens = 1000;

    const generateListConcepts = async () => {
      const conceptText = await this.llm.generate(
        systemPrompt,
        userPrompt,
        maxTokens,
      );

      return this.parseTextToConcepts(conceptText);
    };

    return await tryWithFallback(
      generateListConcepts,
      (concepts) => concepts.length > 0,
      () => Promise.resolve(undefined),
    );
  }

  private generatePrompts(language: string, text: string): [string, string] {
    const systemPrompt = conceptPrompts[language].system;
    const userPrompt = conceptPrompts[language].user.replace(
      '{text}',
      text.slice(0, maxCharactersInput),
    );

    return [systemPrompt, userPrompt];
  }

  /**
   * If the concept appears in the definition, replace it "________" in the definition
   * @param concept concept to replace
   * @param definition the definition where the concept will be replaced
   *
   * @returns the definition with the concept replaced
   */
  private replaceConceptOnDefinition(
    concept: string,
    definition: string,
  ): string {
    return definition.replace(
      new RegExp(concept, 'gi'),
      AgentConceptImpl.placeholder,
    );
  }

  private parseTextToConcepts(conceptText: string): ConceptDto[] {
    const lines = removeMarkdown(conceptText)
      .split('\n')
      .map((line) => line.split(':'))
      .filter((line) => line.length === 2)
      .filter(([concept, definition]) => concept && definition)
      .map(([concept, definition]) => [concept.trim(), definition.trim()]);

    if (!lines.every(([concept, definition]) => concept && definition)) {
      return [];
    }

    return lines.map(([concept, definition]) => ({
      id: UUID.generate(),
      concept,
      definition: this.replaceConceptOnDefinition(concept, definition),
      partId: '',
    }));
  }
}

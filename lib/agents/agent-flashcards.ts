import { LLM } from '@/lib/LLM/interface';
import { FlashcardDto } from '@/lib/dto/flashcard.dto';
import { flashcardPrompts } from '@/lib/prompts/flashcards';
import { tryWithFallback } from '@/lib/agents/utils';
import { UUID } from '@/lib/uuid';
import { AgentQuestion } from '@/lib/agents/interfaces';

export class AgentFlashcardsImpl implements AgentQuestion<FlashcardDto> {
  private llm: LLM;

  static readonly MAX_CHARACTERS_INPUT = 20000;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async createQuestions(
    text: string,
    language: string,
  ): Promise<FlashcardDto[]> {
    const [systemPrompt, userPrompt] = this.generatePrompts(language, text);

    const maxTokens = 3000;

    const generateFlashcards = async () => {
      const flashcardText = await this.llm.generate(
        systemPrompt,
        userPrompt,
        maxTokens,
      );

      return this.parseTextToFlashcards(flashcardText);
    };

    return await tryWithFallback(
      generateFlashcards,
      (flashcards) => flashcards.length > 0,
      () => Promise.resolve([]),
    );
  }

  private generatePrompts(language: string, text: string): [string, string] {
    const systemPrompt = flashcardPrompts[language].system;
    const userPrompt = flashcardPrompts[language].user.replace(
      '{text}',
      text.slice(0, AgentFlashcardsImpl.MAX_CHARACTERS_INPUT),
    );

    return [systemPrompt, userPrompt];
  }

  private parseTextToFlashcards(text: string): FlashcardDto[] {
    text = text.replace(/```json\n/, '').replace(/\n```/, '');
    
    try {
      const json = JSON.parse(text) as { front: string; back: string }[];
      return json
        .map(({ front, back }) => {
          return {
            id: UUID.generate(),
            front: front,
            back: this.removeEnumerationsInMermaid(back),
            partId: '',
            answer: 'no-answered' as 'no-answered',
          };
        })
        .filter((flashcard) => flashcard.front !== '' && flashcard.back !== '');
    } catch (error) {
      return [];
    }
  }

  /**
   * This function takes a flashcard and if it is a mermaid diagram, it removes the enumerations
   * @param flashcard the flashcard
   * @returns the flashcard without the enumerations in mermaid
   */
  private removeEnumerationsInMermaid(flashcard: string): string {
    if (flashcard.startsWith('```mermaid\n')) {
      return flashcard.replace(/^\s*\d+\.\s/gm, '');
    }
    return flashcard;
  }
}

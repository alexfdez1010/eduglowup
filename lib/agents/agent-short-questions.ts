import { LLM } from '@/lib/LLM/interface';
import { ShortQuestionDto } from '@/lib/dto/short-questions.dto';
import { shortQuestionsPrompts } from '@/lib/prompts/short-questions';
import { SectionDto } from '@/lib/dto/section.dto';
import { tryWithFallback } from './utils';
import { UUID } from '@/lib/uuid';
import { AgentQuestion } from '@/lib/agents/interfaces';

const minWords = 30;
const maxWords = 60;

const maxCharactersInput = 20000;

export class AgentShortQuestionsImpl
  implements AgentQuestion<ShortQuestionDto>
{
  private llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async createQuestions(
    text: string,
    language: string,
  ): Promise<ShortQuestionDto[]> {
    const [systemPrompt, userPrompt] = this.generatePrompts(language, text);

    const maxTokens = 1200;

    const fallbackQuestions = [];

    return await tryWithFallback(
      async () =>
        this.parseTextToQuestions(
          await this.llm.generate(systemPrompt, userPrompt, maxTokens),
        ),
      (questions) => questions.length > 0,
      () => Promise.resolve(fallbackQuestions),
    );
  }

  private generatePrompts(language: string, text: string) {
    const systemPrompt = shortQuestionsPrompts[language].system;

    const userPrompt = shortQuestionsPrompts[language].user
      .replace('{text}', text.slice(0, maxCharactersInput))
      .replace('{minWords}', minWords.toString())
      .replace('{maxWords}', maxWords.toString());

    return [systemPrompt, userPrompt];
  }

  private parseTextToQuestions(questionText: string): ShortQuestionDto[] {
    const lines = questionText.split(/\n+/);

    return lines
      .map((line) => {
        try {
          const [question, rubric] = line.split(':');
          return {
            id: UUID.generate(),
            question: question.trim(),
            rubric: rubric.trim(),
            answer: '',
            partId: '',
          };
        } catch (e) {
          return null;
        }
      })
      .filter(
        (question) =>
          question &&
          question.question.length > 0 &&
          question.rubric.length > 0,
      );
  }
}

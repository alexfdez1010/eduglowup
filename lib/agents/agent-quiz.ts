import { QuizQuestionDto } from '@/lib/dto/quiz.dto';
import { LLM } from '@/lib/LLM/interface';
import { quizPrompts } from '@/lib/prompts/quiz';
import { tryWithFallback } from '@/lib/agents/utils';
import { UUID } from '@/lib/uuid';
import { AgentQuestion } from '@/lib/agents/interfaces';

export class AgentQuizImpl implements AgentQuestion<QuizQuestionDto> {
  private llm: LLM;

  public static readonly questionsGenerated = 10;
  public static readonly maxCharactersInput = 20000;
  public static readonly optionsPerQuestion = 4;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async createQuestions(
    text: string,
    language: string,
  ): Promise<QuizQuestionDto[]> {
    const [systemPrompt, userPrompt] = this.generatePrompts(language, text);

    const maxTokens = 2000;

    const generateQuestions = async () => {
      const questionText = await this.llm.generate(
        systemPrompt,
        userPrompt,
        maxTokens,
      );

      return this.parseTextToQuestions(questionText);
    };

    return await tryWithFallback(
      generateQuestions,
      (question) => question.length > 0,
      () => Promise.resolve([]),
    );
  }

  /**
   * This function will generate the prompts (system prompt and user prompt) for the LLM model
   * @param language The language to use to generate the questions
   * @param text The text of the section
   * @return A tuple with the system prompt and the user prompt
   */
  private generatePrompts(language: string, text: string): [string, string] {
    const systemPrompt = quizPrompts[language].system;
    const userPrompt = quizPrompts[language].user.replace(
      '{text}',
      text.slice(0, AgentQuizImpl.maxCharactersInput),
    );

    return [systemPrompt, userPrompt];
  }

  private parseTextToQuestions(text: string): QuizQuestionDto[] {
    const lines = text.split(/\n\n+/);

    return lines
      .map((line) => {
        const question = line
          .split('\n')[0]
          .replace(/^\d+\.\s/, '')
          .trim();
        const choices = line.split('\n').slice(1);

        if (choices.length !== AgentQuizImpl.optionsPerQuestion) {
          return null;
        }

        const correctAnswers = choices.filter((choice) =>
          choice.startsWith('+'),
        );

        if (correctAnswers.length !== 1) {
          return null;
        }

        return {
          id: UUID.generate(),
          question: question,
          answers: choices.map((choice) =>
            choice.replace(/^[+-]\s/, '').trim(),
          ),
          correctAnswer: choices.indexOf(correctAnswers[0]),
          answer: -1,
          partId: '',
        };
      })
      .filter((question) => question !== null);
  }
}

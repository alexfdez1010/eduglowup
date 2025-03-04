import { AgentCorrectorShortQuestions } from '@/lib/agents/interfaces';
import { ShortQuestionDto } from '@/lib/dto/short-questions.dto';
import { shortReportPrompts } from '@/lib/prompts/short-report';
import { LLM } from '@/lib/LLM/interface';

export class AgentCorrectorShortQuestionsImpl
  implements AgentCorrectorShortQuestions
{
  private llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async correct(
    question: ShortQuestionDto,
    sectionText: string,
    language: string,
  ): Promise<[string, number]> {
    const [systemPrompt, userPrompt] = this.generatePrompts(
      question,
      sectionText,
      language,
    );

    const maxTokens = 200;

    let correctionText: string | null;
    let mark: number | null;

    do {
      correctionText = await this.llm.generate(
        systemPrompt,
        userPrompt,
        maxTokens,
      );
      [correctionText, mark] = this.parseTextToCorrection(correctionText);
    } while (correctionText === null);

    return [correctionText, mark];
  }

  /**
   * Generate the prompts for the LLM model
   *
   * @param question The question answered
   * @param sectionText The text of the section
   * @param language The language used to generate the prompts
   * @returns The system and user prompts
   */
  private generatePrompts(
    question: ShortQuestionDto,
    sectionText: string,
    language: string,
  ): [string, string] {
    const systemPrompt = shortReportPrompts[language].system;

    const userPrompt = shortReportPrompts[language].user
      .replace('{section}', sectionText)
      .replace('{question}', question.question)
      .replace('{answer}', question.answer)
      .replace('{rubric}', question.rubric);

    return [systemPrompt, userPrompt];
  }

  /**
   * Parse the text to get the correction and the mark
   *
   * @param correctionText The text with the correction
   * @returns The correction and the mark
   */
  private parseTextToCorrection(correctionText: string): [string, number] {
    const lines = correctionText.split('\n');

    const correction = lines.slice(0, -1).join('\n');
    const mark = lines[lines.length - 1].replace(/\D/g, '').trim();

    if (correction === '' || mark === '') {
      return [null, null];
    }

    const markNumber = parseInt(mark);

    if (isNaN(markNumber)) {
      return [null, null];
    }

    return [correction, markNumber];
  }
}

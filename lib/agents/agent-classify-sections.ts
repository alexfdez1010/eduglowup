import { SectionDto } from '@/lib/dto/section.dto';
import { LLM } from '@/lib/LLM/interface';
import { AgentClassifySections } from '@/lib/agents/interfaces';
import { replaceParametersPrompt } from '@/lib/prompts/utils';
import { classifySectionPrompt } from '@/lib/prompts/classify-section';
import { PartDto } from '@/lib/dto/part.dto';

export class AgentClassifySectionsImpl implements AgentClassifySections {
  private llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async classifySections(
    parts: PartDto[],
    descriptions: string[],
    sectionTexts: string[],
  ): Promise<SectionDto[]> {
    const options = parts.map((part, i) => `${part.name}: ${descriptions[i]}`);
    let optionsSelected = Array(parts.length).fill('');

    await this.binarySearchClassification(
      sectionTexts,
      options,
      0,
      sectionTexts.length - 1,
      optionsSelected,
    );

    return sectionTexts.map((sectionText, index) => {
      return {
        text: sectionText,
        partId: parts.find(
          (part, i) =>
            `${part.name}: ${descriptions[i]}` === optionsSelected[index],
        ).id,
      };
    });
  }

  /**
   * This function uses a binary search algorithm to classify the sections into the parts.
   * It starts in the middle of the array and compares the section with the options. After
   * selecting the section, it divides the options into two groups: left and right.
   * The process continues until all options are selected. For this to work, the parts and
   * the sections must be ordered.
   *
   * @param sectionTexts The texts of the sections
   * @param options The options to classify the sections
   * @param left The left index of the array
   * @param right The right index of the array
   * @param optionsSelected The options selected so far
   */
  private async binarySearchClassification(
    sectionTexts: string[],
    options: string[],
    left: number,
    right: number,
    optionsSelected: string[],
  ): Promise<void> {
    if (left > right) {
      return;
    }

    const middle = Math.floor((left + right) / 2);

    const sectionText = sectionTexts[middle];
    let optionSelected = await this.classifySection(sectionText, options);

    let optionIndex = options.indexOf(optionSelected);

    if (optionIndex === -1) {
      throw new Error('Option not found');
    }

    optionsSelected[middle] = optionSelected;

    await Promise.all([
      this.binarySearchClassification(
        sectionTexts,
        options.slice(0, optionIndex + 1),
        left,
        middle - 1,
        optionsSelected,
      ),
      this.binarySearchClassification(
        sectionTexts,
        options.slice(optionIndex),
        middle + 1,
        right,
        optionsSelected,
      ),
    ]);
  }

  private async classifySection(
    sectionText: string,
    options: string[],
  ): Promise<string> {
    if (options.length === 0) {
      throw new Error('No options available for classification.');
    }

    if (options.length === 1) {
      return options[0];
    }

    let [systemPrompt, userPrompt] = [
      classifySectionPrompt.system,
      classifySectionPrompt.user,
    ];

    const maxTokens = 10;

    systemPrompt = replaceParametersPrompt(systemPrompt, {
      options: options
        .map((option, index) => `${index + 1}. ${option}`)
        .join('\n'),
    });

    userPrompt = replaceParametersPrompt(userPrompt, {
      text: sectionText,
    });

    let text = await this.llm.generate(systemPrompt, userPrompt, maxTokens);

    // Remove all non-numeric characters
    text = text.replace(/[^0-9]/g, '');

    const selection: number = parseInt(text.replace(/\n/g, '').trim());

    if (isNaN(selection) || selection >= options.length || selection < 0) {
      const median = Math.floor(options.length / 2);
      return options[median];
    }

    if (selection === 0) {
      return options[0];
    }

    return options[selection - 1];
  }
}

import { LLM } from '@/lib/LLM/interface';
import {
  analyzeDocumentPrompts,
  notUsefulCommonSections,
} from '@/lib/prompts/split-parts';
import { replaceParametersPrompt } from '@/lib/prompts/utils';
import { AgentSplitParts } from '@/lib/agents/interfaces';
import { PartOutput } from '@/lib/agents/interfaces';

export class AgentSplitPartsImpl implements AgentSplitParts {
  private llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async splitDocumentIntoParts(
    allText: string,
    language: string,
    numberOfSections: number,
  ): Promise<{ name: string; description: string; isUseful: boolean }[]> {
    let [systemPrompt, userPrompt] = this.generatePrompts(language);

    const characterLimit = 20000;

    // We only use the first 20,000 characters (5.000 tokens more or less)
    // of the text thinking that if the document is too long,
    // it will have an index in the start and if it is short
    // all the text will be in the first 20,000 characters
    const textToUse = allText.slice(0, characterLimit);

    const max = Math.min(numberOfSections, 8);

    const maxTokens = 1500;

    userPrompt = replaceParametersPrompt(userPrompt, {
      text: textToUse,
    });

    const text = await this.llm.generate(systemPrompt, userPrompt, maxTokens);
    return this.parseTextToParts(text, language, max);
  }

  private generatePrompts(language: string): [string, string] {
    const systemPrompt = analyzeDocumentPrompts[language].system;
    const userPrompt = analyzeDocumentPrompts[language].user;

    return [systemPrompt, userPrompt];
  }

  private parseTextToParts(
    text: string,
    language: string,
    max: number,
  ): PartOutput[] {
    const parts = text
      .split('\n')
      .filter((line) => line.includes('+') || line.includes('-'))
      .map((line) => line.replace('*', ''))
      .map((line) => line.replace(/^\d+\.\s/, ''))
      .map((line) => line.trim());

    if (parts.length === 0) {
      return [];
    }

    let namesDescriptionsAndUseful = parts.map((part) => {
      const name = part.slice(0, -1).split(':')[0].trim();
      const description = part.slice(0, -1).split(':')[1].trim();
      const isUseful = !(part.slice(-1) === '-');
      return { name, description, isUseful };
    });

    namesDescriptionsAndUseful = this.markAsNotUsefulCommonSections(
      namesDescriptionsAndUseful,
      language,
    );
    namesDescriptionsAndUseful = this.groupNotUsefulParts(
      namesDescriptionsAndUseful,
    );
    namesDescriptionsAndUseful = this.groupUsefulParts(
      namesDescriptionsAndUseful,
      namesDescriptionsAndUseful.length - max,
    );

    return namesDescriptionsAndUseful;
  }

  private markAsNotUsefulCommonSections(
    parts: PartOutput[],
    language: string,
  ): PartOutput[] {
    const notUsefulSections = notUsefulCommonSections[language];

    for (let i = 0; i < parts.length; i++) {
      if (notUsefulSections.includes(parts[i].name.toLowerCase())) {
        parts[i].isUseful = false;
      }
    }

    return parts;
  }

  /**
   * This method will group in only one part the consecutive not useful parts.
   * This will reduce the computational resources required to process the document.
   * @param namesDescriptionsAndUseful The parts to group
   *
   * @returns The grouped parts and the isUseful of each part
   */
  private groupNotUsefulParts(
    namesDescriptionsAndUseful: PartOutput[],
  ): PartOutput[] {
    const groupedParts: PartOutput[] = [];

    let currentPart = '';
    let currentDescription = '';

    for (let i = 0; i < namesDescriptionsAndUseful.length; i++) {
      if (namesDescriptionsAndUseful[i].isUseful) {
        if (currentPart.length > 0) {
          groupedParts.push({
            name: currentPart,
            description: currentDescription,
            isUseful: false,
          });
        }

        groupedParts.push({
          name: namesDescriptionsAndUseful[i].name,
          description: namesDescriptionsAndUseful[i].description,
          isUseful: true,
        });

        currentPart = '';
        currentDescription = '';
      } else {
        if (currentPart.length === 0) {
          currentPart = `${namesDescriptionsAndUseful[i].name}`;
          currentDescription = `${namesDescriptionsAndUseful[i].description}`;
        } else {
          currentPart = `${currentPart} - ${namesDescriptionsAndUseful[i].name}`;
          currentDescription = `${currentDescription} - ${namesDescriptionsAndUseful[i].description}`;
        }
      }
    }

    if (currentPart.length > 0) {
      groupedParts.push({
        name: currentPart,
        description: currentDescription,
        isUseful: false,
      });
    }

    return groupedParts;
  }

  /**
   * Group the parts that are useful to reduce
   * the computational resources required to process the document.
   *
   * In each iteration, selects a consecutive pair of parts that are useful.
   * and merges them into a single part.
   *
   * @param parts the names of the parts
   * @param iterations the number of iterations to perform
   */

  private groupUsefulParts(
    parts: PartOutput[],
    iterations: number,
  ): PartOutput[] {
    let newParts: PartOutput[] = parts.slice();

    for (let i = 0; i < iterations; i++) {
      const pairs = this.getPairs(newParts);

      if (pairs.length === 0) {
        return newParts;
      }

      const lessCharactersPairs = pairs.sort(
        (a, b) =>
          a[0].name.length +
          a[1].name.length -
          b[0].name.length -
          b[1].name.length,
      )[0];

      const indexLeft = newParts.indexOf(lessCharactersPairs[0]);
      const indexRight = newParts.indexOf(lessCharactersPairs[1]);

      newParts[indexLeft] = {
        name: `${newParts[indexLeft].name} - ${newParts[indexRight].name}`,
        description: `${newParts[indexLeft].description} - ${newParts[indexRight].description}`,
        isUseful: true,
      };
      newParts.splice(indexRight, 1);
    }

    return newParts;
  }

  private getPairs(parts: PartOutput[]): PartOutput[][] {
    const pairs: PartOutput[][] = [];

    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i].isUseful && parts[i + 1].isUseful) {
        pairs.push([parts[i], parts[i + 1]]);
      }
    }

    return pairs;
  }
}

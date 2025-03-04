import { SectionDto } from '@/lib/dto/section.dto';

export function getUniqueSectionIds(answer: {
  questions: { sectionId: string }[];
}): string[] {
  return [...new Set(answer.questions.map((question) => question.sectionId))];
}

/**
 * Creates a dictionary mapping section IDs to their entities for quick access.
 *
 * @param {Section[]} allSections Array of all section entities related to the quiz.
 * @returns {Map<string, Section>} A dictionary object mapping section IDs to section entities.
 */
export function createSectionsDictionary(
  allSections: SectionDto[],
): Map<string, SectionDto> {
  let allSectionsDict = new Map<string, SectionDto>();
  allSections.forEach((section) => {
    allSectionsDict.set(section.id, section);
  });

  return allSectionsDict;
}

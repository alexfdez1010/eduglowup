import { PartDto } from '@/lib/dto/part.dto';
import { PartStatisticsDto } from '@/lib/dto/statistics.dto';

export interface HasDate {
  date: string;
}

// We consider only the top N exercises
const NUMBER_OF_EXERCISES_TO_CONSIDER = 3;

export function computeProgressOfContent(
  parts: PartDto[],
  partStatistics: PartStatisticsDto[],
): number {
  const partsProgress = computeProgressByParts(parts, partStatistics);

  const sum = Array.from(partsProgress.values()).reduce((a, b) => a + b, 0);
  return sum / partsProgress.size;
}

export function computeProgressByParts(
  parts: PartDto[],
  partStatistics: PartStatisticsDto[],
): Map<string, number> {
  const progressParts = new Map<string, number>();

  for (const stat of partStatistics) {
    progressParts.set(stat.partId, computeProgressPart(stat));
  }

  for (const part of parts) {
    if (!progressParts.has(part.id)) {
      progressParts.set(part.id, 0);
    }
  }

  return progressParts;
}

function computeProgressPart(stat: PartStatisticsDto): number {
  const coefficients = [
    computeCoefficientCorrect(
      stat.correctConceptQuestions,
      stat.totalConceptQuestions,
    ),
    computeCoefficientCorrect(stat.correctFlashcards, stat.totalFlashcards),
    computeCoefficientCorrect(
      stat.correctQuizQuestions,
      stat.totalQuizQuestions,
    ),
    computeCoefficientCorrect(
      stat.correctShortQuestions,
      stat.totalShortQuestions,
    ),
    computeCoefficientCorrect(
      stat.correctTrueFalseQuestions,
      stat.totalTrueFalseQuestions,
    ),
  ];

  const sortedCoefficients = coefficients.sort((a, b) => b - a);

  return (
    sortedCoefficients
      .slice(0, NUMBER_OF_EXERCISES_TO_CONSIDER)
      .reduce((a, b) => a + b, 0) / NUMBER_OF_EXERCISES_TO_CONSIDER
  );
}

function computeCoefficientCorrect(
  correctAnswers: number,
  totalQuestions: number,
): number {
  if (totalQuestions === 0) {
    return 0;
  }
  return (100 * correctAnswers) / totalQuestions;
}

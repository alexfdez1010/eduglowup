import { computeProgressByParts } from '@/lib/progress';
import { Exercise } from '@/lib/exercises/interface';
import {
  exercisesService,
  ExercisesService,
} from '@/lib/services/exercises-service';
import { PartDto } from '@/lib/dto/part.dto';
import { Graph } from '@/lib/graph';
import {
  DocumentRepository,
  StatisticsRepository,
} from '@/lib/repositories/interfaces';
import { repositories } from '@/lib/repositories/repositories';
import {
  getCumulativeDistribution,
  getProbabilityDistribution,
  selectFromCumulativeDistribution,
} from '@/lib/random';
import { indexMinimum } from '@/lib/utils/general';
import { PartStatisticsDto } from '@/lib/dto/statistics.dto';

export class SelectService {
  private readonly statisticsRepository: StatisticsRepository;
  private readonly documentRepository: DocumentRepository;
  private readonly exercisesService: ExercisesService;
  constructor(
    statisticsRepository: StatisticsRepository,
    documentRepository: DocumentRepository,
    exercisesService: ExercisesService,
  ) {
    this.statisticsRepository = statisticsRepository;
    this.documentRepository = documentRepository;
    this.exercisesService = exercisesService;
  }

  async nextPartAndExercise(
    contentId: string,
    userId: string,
    exercises: string[],
  ): Promise<[PartDto, Exercise]> {
    const [parts, allPartsStatistics, graph] = await Promise.all([
      this.documentRepository.getPartsByDocument(contentId),
      this.statisticsRepository.getAllPartsStatistics(userId, contentId),
      this.documentRepository.getGraphOfParts(contentId),
    ]);

    const progressByPart = computeProgressByParts(parts, allPartsStatistics);

    const possibleNextParts = this.getPossibleNextParts(graph, progressByPart);

    const progressOfPossibleNextParts = possibleNextParts.map((part) =>
      progressByPart.get(part.id),
    );

    const nextPartIndex = this.selectPart(progressOfPossibleNextParts);

    const nextPart = possibleNextParts[nextPartIndex];
    const statisticsNextPart = allPartsStatistics.find(
      (stat) => stat.partId === nextPart.id,
    );
    const exercise = this.selectExercise(
      this.exercisesService.fromStrings(exercises),
      statisticsNextPart,
    );

    return [nextPart, exercise];
  }

  /**
   * Given the graph of parts and the progress of each part, returns the possible next parts
   *
   * @param graph Graph of parts
   * @param progressByPart progress of each part
   */
  getPossibleNextParts(
    graph: Graph<PartDto>,
    progressByPart: Map<string, number>,
  ) {
    return graph.topologicalSort((src, dst) => {
      return progressByPart.get(src.id) >= progressByPart.get(dst.id) - 5;
    });
  }

  private selectPart(progressOfPossibleNextParts: number[]): number {
    const partWithLowestProgressIndex = indexMinimum(
      progressOfPossibleNextParts,
    );

    return partWithLowestProgressIndex;
  }

  private selectExercise(
    exercisesSession: Exercise[],
    statisticsNextPart: PartStatisticsDto | undefined,
  ): Exercise {
    const exercisesNames = exercisesSession.map((exercise) =>
      exercise.getName(),
    );

    const numberofExercisesByType = [
      {
        name: 'flashcards',
        value: statisticsNextPart?.totalFlashcards ?? 0,
      },
      {
        name: 'true-false',
        value: statisticsNextPart?.totalTrueFalseQuestions ?? 0,
      },
      {
        name: 'concepts',
        value: statisticsNextPart?.totalConceptQuestions ?? 0,
      },
      {
        name: 'quiz',
        value: statisticsNextPart?.totalQuizQuestions ?? 0,
      },
      {
        name: 'short-questions',
        value: (statisticsNextPart?.totalShortQuestions ?? 0) * 4,
      },
    ].filter((exercise) => exercisesNames.includes(exercise.name));

    const exerciseWithLessQuestionsIndex = indexMinimum(
      numberofExercisesByType.map((stat) => stat.value),
    );

    const exerciseName =
      numberofExercisesByType[exerciseWithLessQuestionsIndex].name;

    const exercise = exercisesSession.find(
      (exercise) => exercise.getName() === exerciseName,
    );

    return exercise;
  }
}

export const selectService = new SelectService(
  repositories.statistics,
  repositories.document,
  exercisesService,
);

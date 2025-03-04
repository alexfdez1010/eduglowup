import {
  exercisesService,
  ExercisesService,
} from '@/lib/services/exercises-service';

export class ExplanationService {
  private readonly exercisesService: ExercisesService;

  constructor(exerciseService: ExercisesService) {
    this.exercisesService = exerciseService;
  }

  async getExplanation(exercise: string, questionId: string): Promise<string> {
    const exerciseClass = this.exercisesService.getExerciseByName(exercise);

    if (!exerciseClass) {
      return null;
    }

    return await exerciseClass.explanation(questionId);
  }
}

export const explanationService = new ExplanationService(exercisesService);

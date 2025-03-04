import { QuizExercise } from '@/lib/exercises/quiz-exercise';
import { repositories } from '@/lib/repositories/repositories';
import { agents } from '@/lib/agents/agents';
import { TrueFalseExercise } from '@/lib/exercises/true-false-exercise';
import { ShortQuestionsExercise } from '@/lib/exercises/short-questions-exercise';
import { Exercise } from '@/lib/exercises/interface';
import { ConceptExercise } from '@/lib/exercises/concept-exercise';
import { statisticsUpdateService } from '@/lib/services/statistics-update-service';
import { embeddingService } from '@/lib/services/embedding-service';
import { FlashcardsExercise } from '@/lib/exercises/flashcards-exercise';

export class ExercisesService {
  private readonly exercises: Exercise[];

  constructor(exercises: Exercise[]) {
    this.exercises = exercises;
  }

  getExercises(): Exercise[] {
    return this.exercises;
  }

  getExerciseByName(name: string): Exercise {
    return this.getExercises().find((exercise) => exercise.getName() === name);
  }

  fromStrings(exercises: string[]): Exercise[] {
    return exercises
      .map((exercise) => this.getExerciseByName(exercise))
      .filter((exercise) => exercise);
  }
}

export const exercisesService = new ExercisesService([
  new QuizExercise(
    repositories.quizQuestions,
    repositories.document,
    statisticsUpdateService,
    agents.quiz,
    embeddingService,
    agents.explain,
  ),
  new ShortQuestionsExercise(
    repositories.shortQuestions,
    repositories.document,
    statisticsUpdateService,
    agents.shortQuestions,
    agents.correctorShortQuestions,
    embeddingService,
    agents.explain,
  ),
  new TrueFalseExercise(
    repositories.trueFalseQuestions,
    repositories.document,
    statisticsUpdateService,
    agents.trueFalse,
    embeddingService,
    agents.explain,
  ),
  new ConceptExercise(
    repositories.conceptQuestions,
    repositories.document,
    statisticsUpdateService,
    agents.concept,
    agents.explain,
  ),
  new FlashcardsExercise(
    repositories.flashcards,
    repositories.document,
    statisticsUpdateService,
    agents.flashcards,
    agents.explain,
  ),
]);

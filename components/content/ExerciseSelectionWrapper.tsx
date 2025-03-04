import { exercisesService } from '@/lib/services/exercises-service';
import { ExerciseSelection } from '@/components/content/ExerciseSelection';

export default function ExerciseSelectionWrapper() {
  const exercisesNames = exercisesService
    .getExercises()
    .map((exercise) => exercise.getName());

  return <ExerciseSelection exercisesNames={exercisesNames} />;
}

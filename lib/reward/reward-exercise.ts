import { KeyTemplate, Reward } from '@/lib/reward/reward';
import { ExerciseType, ReportReward } from '@/lib/reward/report';

export class FirstExerciseReward extends Reward {
  update(_report: ReportReward): boolean {
    this.progress += this.getGoal();
    return true;
  }

  template(): KeyTemplate {
    return 'first-exercise';
  }
}

export class FirstQuizReward extends Reward {
  update(report: ReportReward): boolean {
    if (report.exerciseType === ExerciseType.QUIZ) {
      this.progress += this.getGoal();
      return true;
    }

    return false;
  }

  template(): KeyTemplate {
    return 'first-quiz';
  }
}

export class FirstTrueFalseReward extends Reward {
  update(report: ReportReward): boolean {
    if (report.exerciseType === ExerciseType.TRUE_FALSE) {
      this.progress += this.getGoal();
      return true;
    }

    return false;
  }

  template(): KeyTemplate {
    return 'first-true-false';
  }
}

export class AllCorrectQuizReward extends Reward {
  update(report: ReportReward): boolean {
    if (
      report.exerciseType !== ExerciseType.QUIZ ||
      report.correctQuestions !== report.totalQuestions
    ) {
      return false;
    }

    this.progress += this.getGoal();

    return true;
  }

  template(): KeyTemplate {
    return 'all-correct-quiz';
  }
}

export class AllCorrectConceptsReward extends Reward {
  update(report: ReportReward): boolean {
    if (
      report.exerciseType !== ExerciseType.CONCEPT ||
      report.correctQuestions !== report.totalQuestions
    ) {
      return false;
    }

    this.progress += this.getGoal();

    return true;
  }

  template(): KeyTemplate {
    return 'all-correct-concepts';
  }
}

import { KeyTemplate, Reward } from '@/lib/reward/reward';
import { ReportReward } from '@/lib/reward/report';

export abstract class UserReward extends Reward {
  update(report: ReportReward): boolean {
    const progress = this.computeProgress(report);

    if (progress === 0) {
      return false;
    }

    this.progress += progress;
    return true;
  }

  abstract computeProgress(report: ReportReward): number;
  abstract template(): KeyTemplate;
}

export class UserCorrectReward extends UserReward {
  computeProgress(report: ReportReward): number {
    return report.correctQuestions;
  }

  template(): KeyTemplate {
    return 'user-correct';
  }
}

export class UserTotalReward extends UserReward {
  computeProgress(report: ReportReward): number {
    return report.totalQuestions;
  }

  template(): KeyTemplate {
    return 'user-total';
  }
}

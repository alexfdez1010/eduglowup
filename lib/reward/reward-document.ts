import { KeyTemplate, Reward } from '@/lib/reward/reward';
import { ReportReward } from '@/lib/reward/report';

abstract class DocumentReward extends Reward {
  update(report: ReportReward): boolean {
    if (report.documentId !== this.getDocumentId()) {
      return false;
    }

    const progress = this.computeProgress(report);

    if (progress === 0) {
      return false;
    }

    this.progress += progress;

    return true;
  }

  abstract computeProgress(report: ReportReward): number;
}

export class DocumentCorrectReward extends DocumentReward {
  computeProgress(report: ReportReward): number {
    return report.correctQuestions;
  }

  template(): KeyTemplate {
    return 'document-correct';
  }
}

export class DocumentTotalReward extends DocumentReward {
  computeProgress(report: ReportReward): number {
    return report.totalQuestions;
  }

  template(): KeyTemplate {
    return 'document-total';
  }
}

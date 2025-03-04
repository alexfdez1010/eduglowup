import { ReportReward } from '@/lib/reward/report';
import { en } from '@/dictionaries/en';

export abstract class Reward {
  private readonly id: string;
  private readonly money: number;
  private readonly goal: number;
  private documentId: string;
  protected progress: number;

  constructor(
    id: string,
    money: number,
    goal: number,
    documentId?: string,
    progress?: number,
  ) {
    this.id = id;
    this.money = money;
    this.goal = goal;
    this.documentId = documentId;
    this.progress = progress ?? 0;
  }

  getPercentageProgress(): number {
    return Math.min((this.progress / this.goal) * 100, 100);
  }

  isFulfilled() {
    return this.progress >= this.goal;
  }

  getMoney(): number {
    return this.money;
  }

  setDocumentId(documentId: string) {
    this.documentId = documentId;
  }

  getDocumentId(): string {
    return this.documentId;
  }

  getId(): string {
    return this.id;
  }

  getGoal(): number {
    return this.goal;
  }

  getProgress(): number {
    return this.progress;
  }

  abstract update(report: ReportReward): boolean;
  abstract template(): KeyTemplate;
}

export type KeyTemplate = keyof (typeof en)['rewards'];

export interface RewardDto {
  progressPercentage: number;
  template: string;
  money: number;
  goal: number;
  documentName?: string;
  action?: () => void;
}

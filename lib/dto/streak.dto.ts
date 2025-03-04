export interface StreakDto {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastStreakDate: string;
}

export interface StreakWithLastWeekDto extends StreakDto {
  lastWeekStreak: boolean[];
}

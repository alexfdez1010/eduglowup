export interface DailyRegistrationsDto {
  registrations: number;
  day: Date;
  dayName: string; // The day of the week as text.
  numberOfDay: number;
  month: string; // This part is unnecessary but makes the code more readable, specially for the frontend.
}

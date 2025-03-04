/**
 * Converts a date to a string in the format YYYY-MM-DD
 * @param date The date to convert
 * @returns The date in the format YYYY-MM-DD
 */
export function dateToString(
  date: Date,
  format: 'YYYY-MM-DD' | 'DD-MM-YYYY' = 'YYYY-MM-DD',
) {
  const formattedDate = date.toISOString().split('T')[0];

  if (format === 'YYYY-MM-DD') {
    return formattedDate;
  } else if (format === 'DD-MM-YYYY') {
    return formattedDate.split('-').reverse().join('-');
  }
}

/**
 * Converts a string in the format YYYY-MM-DD to a date
 * @param date The date in the format YYYY-MM-DD
 * @returns The date
 * @param date
 */
export function stringToDate(date: string) {
  return new Date(date);
}

/**
 * Returns the current date in the format YYYY-MM-DD
 * @returns The current date in the format YYYY-MM-DD
 */
export function todayString() {
  return dateToString(new Date());
}

export function minusDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return dateToString(date);
}

export function weekAgoString() {
  return minusDays(6);
}

export function getDatesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  const currentDate = new Date(start);
  const endDate = new Date(new Date(end).setHours(23, 59, 59, 999));

  while (currentDate <= endDate) {
    dates.push(dateToString(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function getCurrentWeek(weekOffset = 0) {
  // Get the monday of the current week (First day of the week)
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const monday = new Date(currentDate);
  monday.setDate(
    currentDate.getDate() -
      (currentDay === 0 ? 6 : currentDay - 1) +
      weekOffset * 7,
  );

  // Initialize an array to store the days of the week
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const weekDay = new Date(monday); // Copy of monday
    weekDay.setDate(monday.getDate() + i); // Set the date to the monday + deviation.
    week.push(weekDay);
  }
  return week;
}

export function isValidStringDate(date: string) {
  const regex =
    /^(\d{4})([-/])(\d{2})\2(\d{2})$|^(\d{2})([-/])(\d{2})\6(\d{4})$/;

  const match = date.match(regex);

  if (!match) {
    return null;
  }

  if (match[1]) {
    // Format: YYYY/MM/DD or YYYY-MM-DD
    return `${match[1]}/${match[3]}/${match[4]}`;
  } else if (match[5]) {
    // Format: DD/MM/YYYY or DD-MM-YYYY
    return `${match[8]}/${match[7]}/${match[5]}`;
  }

  return null;
}

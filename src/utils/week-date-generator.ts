export interface WeekData {
  week: number;
  month: number;
  year: number;
}

export default function generateWeeksInYear(year: number): WeekData[] {
  const weeksInYear: WeekData[] = [];

  const date = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  while (date < endDate) {
    const week: WeekData = {
      week: getWeekNumber(date),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };

    weeksInYear.push(week);

    date.setDate(date.getDate() + 7);
  }

  return weeksInYear;
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const daysSinceFirstDay = Math.floor((date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24));
  return Math.ceil((daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7);
}

export type RecurrenceType = 'once' | 'daily' | 'weekdays' | 'weekends';

// Helper to format date as YYYY-MM-DD without timezone issues
function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return formatDateString(new Date());
}

export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatDateString(date);
}

export function getWeekRange(dateStr: string) {
  // Return array of 7 date strings (Sun-Sat) containing the given date
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
  
  // Move to start of week (Sunday)
  date.setDate(date.getDate() - dayOfWeek);
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(formatDateString(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function getMonthRange(year: number, month: number): string[] {
  // Returns all dates in a month as YYYY-MM-DD strings
  const days: string[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(year, month, d);
    days.push(formatDateString(date));
  }
  return days;
}

export function getMonthCalendarGrid(year: number, month: number): (string | null)[] {
  // Returns 42 slots (6 weeks x 7 days) with date strings or null for padding
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  
  const grid: (string | null)[] = [];
  
  // Add padding for days before month starts
  for (let i = 0; i < startDayOfWeek; i++) {
    grid.push(null);
  }
  
  // Add all days of the month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    grid.push(formatDateString(date));
  }
  
  // Fill remaining slots to complete the grid (up to 42)
  while (grid.length < 42) {
    grid.push(null);
  }
  
  return grid;
}

export function isDateMatchingRecurrence(
  targetDateStr: string, 
  startDateStr: string, 
  recurrence: RecurrenceType
): boolean {
  if (targetDateStr < startDateStr) return false;

  const [year, month, day] = targetDateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const dayOfWeek = targetDate.getDay(); // 0=Sun, 6=Sat

  switch (recurrence) {
    case 'once':
      return targetDateStr === startDateStr;
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    default:
      return false;
  }
}

export function getDayName(dateStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function getFormattedDate(dateStr: string): string {
    // Returns "01 Jan 2025" format
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayStr = date.getDate().toString().padStart(2, '0');
    const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
    return `${dayStr} ${monthStr} ${year}`;
}

export function getShortDate(dateStr: string): string {
    // Returns "01 Jan" format (without year)
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayStr = date.getDate().toString().padStart(2, '0');
    const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
    return `${dayStr} ${monthStr}`;
}

export function getMonthName(month: number): string {
    const date = new Date(2000, month, 1);
    return date.toLocaleDateString('en-US', { month: 'long' });
}

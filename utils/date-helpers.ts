export type RecurrenceType = 'once' | 'daily' | 'weekdays' | 'weekends';

export function getTodayDateString(): string {
  // Returns YYYY-MM-DD for the current user's local time (or server time, effectively)
  // Note: Dealing with TZs can be complex. For simplicity in this user-centric app, 
  // we'll rely on server time or simple JS dates. 
  // Ideally, passes a TZ, but let's stick to standard ISO date part.
  const date = new Date();
  return date.toISOString().split('T')[0];
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function getWeekRange(dateStr: string) {
  // Return array of 7 date strings (Sun-Sat) containing the given date
  const date = new Date(dateStr);
  const day = date.getDay(); // 0 (Sun) to 6 (Sat)
  const diff = date.getDate() - day; // adjust when day is sunday
  
  const startOfWeek = new Date(date.setDate(diff));
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export function isDateMatchingRecurrence(
  targetDateStr: string, 
  startDateStr: string, 
  recurrence: RecurrenceType
): boolean {
  if (targetDateStr < startDateStr) return false;

  const targetDate = new Date(targetDateStr);
  const day = targetDate.getDay(); // 0=Sun, 6=Sat

  switch (recurrence) {
    case 'once':
      return targetDateStr === startDateStr;
    case 'daily':
      return true;
    case 'weekdays':
      return day >= 1 && day <= 5;
    case 'weekends':
      return day === 0 || day === 6;
    default:
      return false;
  }
}

export function getDayName(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' }); // e.g. "Monday"
}

export function getFormattedDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

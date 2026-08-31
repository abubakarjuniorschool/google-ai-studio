/**
 * Date and Week utilities for Abubakar
 */

export function getWeekNumber(d: Date): number {
  // Copy date so don't modify original
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}

export function getWeekRangeLabel(weekNo: number, year: number = 2026): string {
  // Calculate start (Monday) and end (Sunday) of week number
  const simple = new Date(year, 0, 1 + (weekNo - 1) * 7);
  const dow = simple.getDay();
  const weekStart = simple;
  if (dow <= 4) {
    weekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    weekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startMonth = weekStart.toLocaleString('default', { month: 'short' });
  const endMonth = weekEnd.toLocaleString('default', { month: 'short' });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();

  if (startMonth === endMonth) {
    return `Week ${weekNo} • ${startMonth} ${startDay}–${endDay}`;
  }
  return `Week ${weekNo} • ${startMonth} ${startDay} – ${endMonth} ${endDay}`;
}

export function formatDatePretty(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

// A FIXED reference "today" so that the relative views ("Due this week", "Overdue") are
// deterministic across the DOM and E2E runs. The app never reads the wall clock.
// 2026-06-15 is a Monday, which makes the surrounding week boundaries easy to reason about.
export const TODAY = '2026-06-15';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Parse a `yyyy-mm-dd` string as a local calendar date (midnight local), avoiding the UTC shift
// `new Date('yyyy-mm-dd')` would introduce.
export function parseCalendarDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isOverdue(dueIso: string, today: string = TODAY): boolean {
  return parseCalendarDate(dueIso).getTime() < parseCalendarDate(today).getTime();
}

// The Monday..Sunday week that contains `today`.
export function weekRange(today: string = TODAY): { from: string; to: string } {
  const date = parseCalendarDate(today);
  const dayOfWeek = (date.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(date.getTime() - dayOfWeek * MS_PER_DAY);
  const sunday = new Date(monday.getTime() + 6 * MS_PER_DAY);
  return { from: toIso(monday), to: toIso(sunday) };
}

export function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

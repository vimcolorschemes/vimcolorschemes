/**
 * Formats a date as a human-readable relative time (e.g. "2 days ago").
 */
export function formatDate(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffMs < minute) return rtf.format(0, 'second');
  if (diffMs < hour) return rtf.format(-Math.floor(diffMs / minute), 'minute');
  if (diffMs < day) return rtf.format(-Math.floor(diffMs / hour), 'hour');
  if (diffMs < week) return rtf.format(-Math.floor(diffMs / day), 'day');
  if (diffMs < month) return rtf.format(-Math.floor(diffMs / week), 'week');
  if (diffMs < year) return rtf.format(-Math.floor(diffMs / month), 'month');
  return rtf.format(-Math.floor(diffMs / year), 'year');
}

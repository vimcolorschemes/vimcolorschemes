import { formatDistanceToNow } from 'date-fns';

/**
 * Format a date to a relative time.
 *
 * @example
 * DateHelper.format(new Date('2020-01-01')) === '2 years ago'
 *
 * @param date The date to format.
 * @returns The formatted date.
 */
function format(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

const DateHelper = { format };
export default DateHelper;

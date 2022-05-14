import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

/**
 * Formats the given date relative to now's time
 *
 * @param {string} date - The date to format
 * @returns {string} The formatted date
 */
function fromNow(date: string): string {
  return dayjs(date).fromNow();
}

/**
 * Formats the given date to the ISO8601 standard format
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted date
 */
function toISO8601(date: Date): string {
  return dayjs(date).toISOString();
}

const DateHelper = {
  fromNow,
  toISO8601,
};

export default DateHelper;

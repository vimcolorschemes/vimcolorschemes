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

const DateHelper = {
  fromNow,
};

export default DateHelper;

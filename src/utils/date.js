import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const WEEK_DAYS_COUNT = 7;

export const format = date => dayjs(date).fromNow();

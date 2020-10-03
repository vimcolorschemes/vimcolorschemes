import dayjs from "dayjs";

// Computes the stargazers count for the last <daysCount> days
export const computeTrendingStargazersCount = (
  { stargazers_count_history: history, github_created_at },
  daysCount,
) => {
  let trendingStargazersCount = 0;

  if ((history || []).length > 0) {
    const stargazersHistory = history.slice(
      Math.max(history.length - daysCount, 0),
    );
    const aWeekAgo = dayjs().subtract(daysCount, "day");
    const firstDayCount =
      dayjs(github_created_at) >= aWeekAgo
        ? 0
        : stargazersHistory[0].stargazers_count;
    const lastDayCount =
      stargazersHistory[stargazersHistory.length - 1].stargazers_count;
    trendingStargazersCount = lastDayCount - firstDayCount;
  }

  return trendingStargazersCount >= 0 ? trendingStargazersCount : 0;
};

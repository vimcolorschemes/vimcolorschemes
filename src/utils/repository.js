import dayjs from "dayjs";

// Returns the usable first image; that was properly processed at build time
export const getFirstProcessedFluidImage = (featuredImage, images) => {
  if (isValidProcessedFluidImage(featuredImage))
    return featuredImage.childImageSharp.fluid;

  if (!images || images.length < 1 || !Array.isArray(images)) return null;

  const fallbackImage = images.find(isValidProcessedFluidImage);
  return fallbackImage ? fallbackImage.childImageSharp.fluid : null;
};

const isValidProcessedFluidImage = imageObject =>
  imageObject &&
  imageObject.childImageSharp &&
  imageObject.childImageSharp.fluid;

// Computes the stargazers count for the last <dayCount> days
export const computeTrendingStargazersCount = (
  stargazersCountHistory,
  repositoryCreatedAt,
  dayCount,
  stargazersCountKey = "stargazers_count",
) => {
  let trendingStargazersCount = 0;

  if (typeof dayCount !== "number" || dayCount < 1) return 0;

  if ((stargazersCountHistory || []).length > 0) {
    const timeframeHistory = stargazersCountHistory.slice(
      Math.max(stargazersCountHistory.length - dayCount, 0),
    );
    const historyStart = dayjs().subtract(dayCount, "day");
    const firstDayCount =
      dayjs(repositoryCreatedAt) >= historyStart
        ? 0
        : timeframeHistory[0][stargazersCountKey];
    const lastDayCount =
      timeframeHistory[timeframeHistory.length - 1][stargazersCountKey];
    trendingStargazersCount = lastDayCount - firstDayCount;
  }

  return trendingStargazersCount >= 0 ? trendingStargazersCount : 0;
};

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

export const getValidImageUrls = (imageUrls, excludeList) => {};

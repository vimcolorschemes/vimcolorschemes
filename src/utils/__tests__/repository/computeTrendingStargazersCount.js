import { computeTrendingStargazersCount } from "src/utils/repository";

const generateWeekStargazersHistory = (dayCount, increase = 0, start = 0) => {
  const history = new Array(dayCount).fill({});
  let stargazersCount = start ? start : Math.floor(Math.random() * 100 + 1);
  return history.map((_, index) => {
    if (index === Math.floor(history.length / 2))
      stargazersCount += Math.floor(increase / 2);
    if (index === history.length - 1)
      stargazersCount += Math.ceil(increase / 2);
    return {
      stargazers_count: stargazersCount,
    };
  });
};

test("computeTrendingStargazersCount with undefined or null values", () => {
  expect(computeTrendingStargazersCount(null, null, null)).toBe(0);
  expect(computeTrendingStargazersCount(undefined, null, null)).toBe(0);
  expect(computeTrendingStargazersCount(null, undefined, null)).toBe(0);
  expect(computeTrendingStargazersCount(null, null, undefined)).toBe(0);
  expect(computeTrendingStargazersCount(undefined, undefined, undefined)).toBe(
    0,
  );
  expect(computeTrendingStargazersCount(null, undefined, undefined)).toBe(0);
  expect(computeTrendingStargazersCount(undefined, null, undefined)).toBe(0);
  expect(computeTrendingStargazersCount(undefined, undefined, null)).toBe(0);
});

test("computeTrendingStargazersCount with invalid history", () => {
  expect(computeTrendingStargazersCount(1, new Date(), 7)).toBe(0);
  expect(computeTrendingStargazersCount("", new Date(), 7)).toBe(0);
  expect(computeTrendingStargazersCount({}, new Date(), 7)).toBe(0);
});

test("computeTrendingStargazersCount with empty history", () => {
  expect(computeTrendingStargazersCount([], new Date(), 7)).toBe(0);
});

test("computeTrendingStargazersCount with invalid createdAt", () => {
  const dayCount = 7;
  const historyWithNoIncrease = generateWeekStargazersHistory(dayCount);
  expect(
    computeTrendingStargazersCount(historyWithNoIncrease, "test", dayCount),
  ).toBe(0);

  const increase = 20;
  const historyWithIncrease = generateWeekStargazersHistory(dayCount, increase);
  expect(
    computeTrendingStargazersCount(historyWithIncrease, "test", dayCount),
  ).toBe(increase);
});

test("computeTrendingStargazersCount with invalid dayCount", () => {
  expect(
    computeTrendingStargazersCount(
      generateWeekStargazersHistory(7),
      new Date(),
      "",
    ),
  ).toBe(0);
  expect(
    computeTrendingStargazersCount(
      generateWeekStargazersHistory(20, 20),
      new Date(),
      -1,
    ),
  ).toBe(0);
});

test("computeTrendingStargazersCount with wrong count key", () => {
  expect(
    computeTrendingStargazersCount(
      generateWeekStargazersHistory(20, 20),
      new Date(),
      1,
      "wrong_key",
    ),
  ).toBe(0);
});

test("computeTrendingStargazersCount with older createdAt than dayCount", () => {
  const increase = 20;
  const dayCount = 7;
  const history = generateWeekStargazersHistory(dayCount, increase);
  expect(
    computeTrendingStargazersCount(history, new Date("1900-01-01"), dayCount),
  ).toBe(increase);
});

test("computeTrendingStargazersCount with younger createdAt than dayCount", () => {
  const increase = 20;
  const start = 10;
  const history = generateWeekStargazersHistory(20, increase, start);
  expect(computeTrendingStargazersCount(history, new Date(), 7)).toBe(
    start + increase,
  );
});

test("computeTrendingStargazersCount with less history than dayCount on old repository", () => {
  const increase = 20;
  const history = generateWeekStargazersHistory(5, increase);
  expect(
    computeTrendingStargazersCount(history, new Date("1900-01-01"), 7),
  ).toBe(increase);
});

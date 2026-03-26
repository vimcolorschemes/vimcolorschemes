export const SortOptions = {
  Trending: 'trending',
  Top: 'top',
  New: 'new',
  Old: 'old',
} as const;
export type Sort = (typeof SortOptions)[keyof typeof SortOptions];

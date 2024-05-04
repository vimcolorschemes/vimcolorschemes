export const SortOptions = {
  Trending: 'trending',
  Top: 'top',
  New: 'new',
  Old: 'old',
} as const;
type Sort = (typeof SortOptions)[keyof typeof SortOptions];

export default Sort;

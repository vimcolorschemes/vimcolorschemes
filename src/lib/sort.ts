import RepositoryDTO from '@/models/DTO/repository';

export const SortOrders = { Ascending: 'asc', Descending: 'desc' } as const;
export type SortOrder = (typeof SortOrders)[keyof typeof SortOrders];

export const SortOptions = {
  Trending: 'trending',
  Top: 'top',
  New: 'new',
  Old: 'old',
  RecentlyUpdated: 'recently-updated',
};
export type SortOption = (typeof SortOptions)[keyof typeof SortOptions];

export const SortOptionMap: Record<SortOption, Sort> = {
  [SortOptions.Trending]: {
    property: 'weekStargazersCount',
    order: SortOrders.Descending,
  },
  [SortOptions.Top]: {
    property: 'stargazersCount',
    order: SortOrders.Descending,
  },
  [SortOptions.RecentlyUpdated]: {
    property: 'lastCommitAt',
    order: SortOrders.Descending,
  },
  [SortOptions.New]: {
    property: 'githubCreatedAt',
    order: SortOrders.Descending,
  },
  [SortOptions.Old]: {
    property: 'githubCreatedAt',
    order: SortOrders.Ascending,
  },
};

type Sort = { property: keyof RepositoryDTO; order: SortOrder };
export default Sort;

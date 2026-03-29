'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { RepositoriesClientService } from '@/services/repositoriesClient';

import { RepositoryDTO } from '@/models/DTO/repository';

import type { BackgroundFilter } from '@/lib/filter';
import type { Sort } from '@/lib/sort';

type UseRepositorySearchParams = {
  query: string;
  sort: Sort;
  background?: BackgroundFilter;
  initialData?: {
    repositories: RepositoryDTO[];
    count: number;
    hasMore: boolean;
  };
};

export function useRepositorySearch({
  query,
  sort,
  background,
  initialData,
}: UseRepositorySearchParams) {
  const trimmedQuery = query.trim();
  const hasSearch = trimmedQuery.length > 0;

  const searchQuery = useInfiniteQuery({
    queryKey: ['repository-search', sort, background ?? null, trimmedQuery],
    initialPageParam: 1,
    enabled: hasSearch,
    queryFn: ({ pageParam, signal }) =>
      RepositoriesClientService.fetchRepositories({
        sort,
        filter: {
          search: trimmedQuery,
          background,
        },
        page: pageParam,
        signal,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return allPages.length + 1;
    },
    initialData: initialData
      ? {
          pages: [
            {
              repositories: initialData.repositories,
              count: initialData.count,
              hasMore: initialData.hasMore,
            },
          ],
          pageParams: [1],
        }
      : undefined,
  });

  const results = hasSearch
    ? (searchQuery.data?.pages.flatMap(page => page.repositories) ?? null)
    : null;
  const count = hasSearch ? (searchQuery.data?.pages[0]?.count ?? 0) : 0;

  return {
    results,
    count,
    isLoading: hasSearch && searchQuery.isPending,
    isLoadingMore: hasSearch && searchQuery.isFetchingNextPage,
    hasMore: hasSearch && searchQuery.hasNextPage,
    loadMoreSearchResults: () => void searchQuery.fetchNextPage(),
  };
}

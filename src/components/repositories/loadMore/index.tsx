'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { use } from 'react';

import { RepositoriesClientService } from '@/services/repositoriesClient';

import { RepositoryDTO } from '@/models/DTO/repository';

import type { PageContext } from '@/lib/pageContext';

import RepositoriesGrid from '@/components/repositories/grid';
import LoadMoreButton from '@/components/repositories/loadMoreButton';

type LoadMoreProps = {
  pageContext: PageContext;
  initialRepositoriesPromise: Promise<RepositoryDTO[]>;
  countPromise: Promise<number>;
};

export default function LoadMore({
  pageContext,
  initialRepositoriesPromise,
  countPromise,
}: LoadMoreProps) {
  const initialRepositories = use(initialRepositoriesPromise);
  const count = use(countPromise);

  const repositoriesQuery = useInfiniteQuery({
    queryKey: ['repositories', pageContext.sort, pageContext.filter],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      RepositoriesClientService.fetchRepositories({
        sort: pageContext.sort,
        filter: pageContext.filter,
        page: pageParam,
        signal,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return allPages.length + 1;
    },
    initialData: {
      pages: [
        {
          repositories: initialRepositories,
          count,
          hasMore: initialRepositories.length < count,
        },
      ],
      pageParams: [1],
    },
  });

  const repositories =
    repositoriesQuery.data?.pages.slice(1).flatMap(page => page.repositories) ??
    [];
  const hasMore = repositoriesQuery.hasNextPage;

  return (
    <>
      {repositories.length > 0 && (
        <RepositoriesGrid
          repositories={repositories}
          pageContext={pageContext}
        />
      )}
      {hasMore && (
        <LoadMoreButton
          loading={repositoriesQuery.isFetchingNextPage}
          onClick={() => void repositoriesQuery.fetchNextPage()}
        />
      )}
    </>
  );
}

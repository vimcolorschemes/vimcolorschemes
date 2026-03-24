'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { use } from 'react';

import RepositoriesClientService, {
  parseRepositoryDTO,
} from '@/services/repositoriesClient';

import RepositoryDTO from '@/models/DTO/repository';

import PageContext from '@/lib/pageContext';

import RepositoriesGrid from '@/components/repositories/grid';
import LoadMoreButton from '@/components/repositories/loadMoreButton';

type LoadMoreProps = {
  pageContext: PageContext;
  initialRepositoriesPromise: Promise<RepositoryDTO[]>;
  countPromise: Promise<number>;
  initialCountPromise: Promise<number>;
};

export default function LoadMore({
  pageContext,
  initialRepositoriesPromise,
  countPromise,
  initialCountPromise,
}: LoadMoreProps) {
  const initialRepositories = use(initialRepositoriesPromise).map(
    parseRepositoryDTO,
  );
  const count = use(countPromise);
  const initialCount = use(initialCountPromise);

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
      const loadedCount = allPages.reduce(
        (total, page) => total + page.repositories.length,
        0,
      );

      if (loadedCount >= lastPage.count) {
        return undefined;
      }

      return allPages.length + 1;
    },
    initialData: {
      pages: [
        {
          repositories: initialRepositories,
          count,
        },
      ],
      pageParams: [1],
    },
  });

  const repositories =
    repositoriesQuery.data?.pages.slice(1).flatMap(page => page.repositories) ??
    [];
  const hasMore = initialCount < count && repositoriesQuery.hasNextPage;

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

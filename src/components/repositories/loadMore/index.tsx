'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { use, useMemo, useState } from 'react';

import { RepositoriesClientService } from '@/services/repositoriesClient';
import { RepositorySearchManifestClient } from '@/services/repositorySearchManifestClient';

import { RepositoryDTO } from '@/models/DTO/repository';

import { Constants } from '@/lib/constants';
import type { PageContext } from '@/lib/pageContext';

import { RepositorySearchHelper } from '@/helpers/repositorySearch';

import RepositoriesGrid from '@/components/repositories/grid';
import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';
import LoadMoreButton from '@/components/repositories/loadMoreButton';

import styles from '../index.module.css';

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
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  const hasSearch = query.length > 0;
  const searchKey = `${query}:${pageContext.sort}:${
    pageContext.filter.background ?? ''
  }`;
  const [searchPagination, setSearchPagination] = useState({
    key: searchKey,
    page: 1,
  });
  const searchPage =
    searchPagination.key === searchKey ? searchPagination.page : 1;

  const repositoriesQuery = useInfiniteQuery({
    queryKey: ['repositories', pageContext.sort, pageContext.filter],
    initialPageParam: 1,
    enabled: !hasSearch,
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

  const manifestQuery = useQuery({
    queryKey: ['repository-search-manifest'],
    queryFn: RepositorySearchManifestClient.loadRepositorySearchManifest,
    enabled: hasSearch,
    staleTime: Infinity,
  });

  const searchResult = useMemo(() => {
    if (!hasSearch || !manifestQuery.data) {
      return null;
    }

    return RepositorySearchHelper.searchRepositories({
      repositories: manifestQuery.data,
      query,
      sort: pageContext.sort,
      filter: pageContext.filter,
      page: searchPage,
      pageSize: Constants.REPOSITORY_PAGE_SIZE,
    });
  }, [
    hasSearch,
    manifestQuery.data,
    pageContext.filter,
    pageContext.sort,
    query,
    searchPage,
  ]);

  if (hasSearch) {
    const searchCount = searchResult?.count ?? 0;

    return (
      <>
        <RepositoriesHeader count={searchCount} title={getSearchTitle(query)} />
        {manifestQuery.isPending && <RepositoriesGridSkeleton />}
        {manifestQuery.isError && <p>search failed to load</p>}
        {searchResult && (
          <>
            {searchResult.repositories.length > 0 && (
              <RepositoriesGrid
                repositories={searchResult.repositories}
                pageContext={pageContext}
              />
            )}
            {searchResult.repositories.length === 0 && <p>no results found</p>}
            {searchResult.hasMore && (
              <LoadMoreButton
                loading={false}
                onClick={() =>
                  setSearchPagination(currentPagination => ({
                    key: searchKey,
                    page:
                      currentPagination.key === searchKey
                        ? currentPagination.page + 1
                        : 2,
                  }))
                }
              />
            )}
          </>
        )}
      </>
    );
  }

  const repositories =
    repositoriesQuery.data?.pages.flatMap(page => page.repositories) ?? [];
  const hasMore = repositoriesQuery.hasNextPage;

  return (
    <>
      <RepositoriesHeader count={count} title={pageContext.sort} />
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

function RepositoriesHeader({
  count,
  title,
}: {
  count: number;
  title: string;
}) {
  return (
    <div className={styles.header}>
      <h2 id="repositories-title" className={styles.title}>
        {title}
        <span className={styles.count}>
          {count} repositor{count === 1 ? 'y' : 'ies'}
        </span>
      </h2>
    </div>
  );
}

function getSearchTitle(query: string): string {
  return `results for "${query}"`;
}

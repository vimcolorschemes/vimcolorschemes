'use client';

import { useQuery } from '@tanstack/react-query';
import { useId, useMemo, useState } from 'react';

import { RepositorySearchManifestClient } from '@/services/repositorySearchManifestClient';

import { Constants } from '@/lib/constants';
import type { PageContext } from '@/lib/pageContext';

import { RepositorySearchHelper } from '@/helpers/repositorySearch';

import RepositoriesGrid from '@/components/repositories/grid';
import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';
import RepositoriesHeader from '@/components/repositories/header';
import LoadMoreButton from '@/components/repositories/loadMoreButton';

import repositoriesStyles from '../index.module.css';

import styles from './index.module.css';

type RepositorySearchProps = {
  pageContext: PageContext;
  query: string;
};

export default function RepositorySearch({
  pageContext,
  query,
}: RepositorySearchProps) {
  const headingId = useId();
  const searchKey = `${query}:${pageContext.sort}:${
    pageContext.filter.background ?? ''
  }`;
  const [searchPagination, setSearchPagination] = useState({
    key: searchKey,
    page: 1,
  });
  const searchPage =
    searchPagination.key === searchKey ? searchPagination.page : 1;

  const manifestQuery = useQuery({
    queryKey: ['repository-search-manifest'],
    queryFn: RepositorySearchManifestClient.loadRepositorySearchManifest,
    staleTime: Infinity,
  });

  const searchResult = useMemo(() => {
    if (!manifestQuery.data) {
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
    manifestQuery.data,
    pageContext.filter,
    pageContext.sort,
    query,
    searchPage,
  ]);

  const statusMessage = getStatusMessage({
    isPending: manifestQuery.isPending,
    query,
    searchResult,
  });

  return (
    <section
      aria-busy={manifestQuery.isPending}
      aria-labelledby={headingId}
      className={repositoriesStyles.container}
    >
      <RepositoriesHeader
        count={searchResult?.count}
        headingId={headingId}
        query={query}
        title="results for"
      />
      <p
        aria-atomic="true"
        aria-live="polite"
        className={styles.status}
        role="status"
      >
        {statusMessage}
      </p>
      {manifestQuery.isPending && <RepositoriesGridSkeleton announce={false} />}
      {manifestQuery.isError && <p role="alert">search failed to load</p>}
      {searchResult && (
        <>
          {searchResult.repositories.length > 0 && (
            <RepositoriesGrid
              repositories={searchResult.repositories}
              pageContext={pageContext}
            />
          )}
          {searchResult.repositories.length === 0 && (
            <p className={styles.emptyState}>no results found</p>
          )}
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
    </section>
  );
}

type SearchStatusParams = {
  isPending: boolean;
  query: string;
  searchResult: ReturnType<
    typeof RepositorySearchHelper.searchRepositories
  > | null;
};

function getStatusMessage({
  isPending,
  query,
  searchResult,
}: SearchStatusParams): string {
  if (isPending) {
    return 'searching repositories';
  }

  if (!searchResult) {
    return '';
  }

  if (searchResult.count === 0) {
    return `no repositories found for "${query}"`;
  }

  const repositoryLabel = `repositor${searchResult.count === 1 ? 'y' : 'ies'}`;

  return `${searchResult.count} ${repositoryLabel} found for "${query}"; ${searchResult.repositories.length} shown`;
}

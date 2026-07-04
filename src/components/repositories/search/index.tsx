'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { RepositorySearchManifestClient } from '@/services/repositorySearchManifestClient';

import { Constants } from '@/lib/constants';
import type { PageContext } from '@/lib/pageContext';

import { RepositorySearchHelper } from '@/helpers/repositorySearch';

import RepositoriesGrid from '@/components/repositories/grid';
import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';
import RepositoriesHeader from '@/components/repositories/header';
import LoadMoreButton from '@/components/repositories/loadMoreButton';

import styles from './index.module.css';

type RepositorySearchProps = {
  pageContext: PageContext;
  query: string;
};

export default function RepositorySearch({
  pageContext,
  query,
}: RepositorySearchProps) {
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

  return (
    <>
      <RepositoriesHeader
        count={searchResult?.count}
        query={query}
        title="results for"
      />
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
    </>
  );
}

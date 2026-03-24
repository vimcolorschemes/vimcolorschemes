'use client';

import RepositoryDTO from '@/models/DTO/repository';

import PageContext from '@/lib/pageContext';

import { useSearchNavigation } from '@/components/providers/searchNavigationProvider';
import useRepositorySearch from '@/hooks/useRepositorySearch';

import RepositoriesGrid from '@/components/repositories/grid';
import LoadMoreButton from '@/components/repositories/loadMoreButton';
import RepositoriesSkeleton from '@/components/repositories/skeleton';

import styles from './index.module.css';

type SearchResultsProps = {
  query: string;
  pageContext: PageContext;
  initialRepositories?: RepositoryDTO[];
  initialCount?: number;
};

export default function SearchResults({
  query,
  pageContext,
  initialRepositories,
  initialCount,
}: SearchResultsProps) {
  const { isNavigatingSearch } = useSearchNavigation();
  const {
    results,
    count,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMoreSearchResults,
  } = useRepositorySearch({
    query,
    sort: pageContext.sort,
    background: pageContext.filter.background,
    initialData:
      initialRepositories && initialCount != null
        ? {
            repositories: initialRepositories,
            count: initialCount,
          }
        : undefined,
  });

  if (isNavigatingSearch) {
    return <RepositoriesSkeleton />;
  }

  if (isLoading && results === null) {
    return <RepositoriesSkeleton />;
  }

  if (results === null) {
    return <RepositoriesSkeleton />;
  }

  return (
    <div className={styles.container}>
      <p>
        {count} result{count === 1 ? '' : 's'}
      </p>
      <RepositoriesGrid repositories={results} pageContext={pageContext} />
      {hasMore && (
        <LoadMoreButton
          loading={isLoadingMore}
          onClick={loadMoreSearchResults}
        />
      )}
      {results.length === 0 && !isLoading && <p>no results found</p>}
    </div>
  );
}

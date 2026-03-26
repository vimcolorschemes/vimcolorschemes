'use client';

import { RepositoryDTO } from '@/models/DTO/repository';

import type { PageContext } from '@/lib/pageContext';

import { useRepositorySearch } from '@/hooks/useRepositorySearch';

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

  if (isLoading && results === null) {
    return <RepositoriesSkeleton />;
  }

  if (results === null) {
    return <RepositoriesSkeleton />;
  }

  return (
    <section
      className={styles.container}
      aria-labelledby="search-results-title"
    >
      <div className={styles.header}>
        <h1 id="search-results-title" className={styles.title}>
          Results
          <span className={styles.count}>
            {count} repositor{count === 1 ? 'y' : 'ies'}
          </span>
        </h1>
      </div>
      <RepositoriesGrid repositories={results} pageContext={pageContext} />
      {hasMore && (
        <LoadMoreButton
          loading={isLoadingMore}
          onClick={loadMoreSearchResults}
        />
      )}
      {results.length === 0 && !isLoading && <p>no results found</p>}
    </section>
  );
}

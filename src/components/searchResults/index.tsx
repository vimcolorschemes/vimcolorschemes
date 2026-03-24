'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import PageContextHelper from '@/helpers/pageContext';

import { useSearch } from '@/context/searchContext';

import RepositoriesGrid from '@/components/repositories/grid';
import LoadMoreButton from '@/components/repositories/loadMoreButton';
import RepositoriesSkeleton from '@/components/repositories/skeleton';

import styles from './index.module.css';

type SearchResultsProps = {
  children: ReactNode;
};

export default function SearchResults({ children }: SearchResultsProps) {
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(2));
  const { results, count, isLoading, isLoadingMore, loadMoreSearchResults } =
    useSearch();

  if (isLoading && results === null) {
    return <RepositoriesSkeleton />;
  }

  if (results === null) {
    return <>{children}</>;
  }

  const hasMore = results.length < count;

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

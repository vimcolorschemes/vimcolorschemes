'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import PageContextHelper from '@/helpers/pageContext';

import { useSearch } from '@/context/searchContext';

import RepositoriesSkeleton from '@/components/repositories/skeleton';
import RepositoryCard from '@/components/repositoryCard';

import styles from './index.module.css';

type SearchResultsProps = {
  children: ReactNode;
};

export default function SearchResults({ children }: SearchResultsProps) {
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(2));
  const { results, count, isSearching, loadMoreSearchResults } = useSearch();

  if (isSearching && results === null) {
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
      <section className={styles.grid}>
        {results.map(repository => (
          <RepositoryCard
            key={repository.key}
            repository={repository}
            pageContext={pageContext}
          />
        ))}
      </section>
      {hasMore && (
        <button
          onClick={loadMoreSearchResults}
          disabled={isSearching}
          className={styles.button}
        >
          {isSearching ? 'loading...' : 'load more'}
        </button>
      )}
      {results.length === 0 && !isSearching && <p>no results found</p>}
    </div>
  );
}

'use client';

import { useCallback, useState } from 'react';

import RepositoriesClientService from '@/services/repositoriesClient';

import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import LoadMoreButton from '@/components/repositories/loadMoreButton';
import RepositoryCard from '@/components/repositoryCard';

import styles from './index.module.css';

type LoadMoreProps = {
  pageContext: PageContext;
  count: number;
  initialCount: number;
};

export default function LoadMore({
  pageContext,
  count,
  initialCount,
}: LoadMoreProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const renderedCount = initialCount + repositories.length;
  const hasMore = renderedCount < count;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const nextPage = page + 1;

    try {
      const data = await RepositoriesClientService.fetchRepositories({
        sort: pageContext.sort,
        filter: pageContext.filter,
        page: nextPage,
      });

      setRepositories(prev => [...prev, ...data.repositories]);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageContext]);

  return (
    <>
      {repositories.length > 0 && (
        <section className={styles.grid}>
          {repositories.map(repository => (
            <RepositoryCard
              key={repository.key}
              repository={repository}
              pageContext={pageContext}
            />
          ))}
        </section>
      )}
      {hasMore && <LoadMoreButton loading={loading} onClick={loadMore} />}
    </>
  );
}

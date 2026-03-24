'use client';

import { useCallback, useState } from 'react';

import RepositoryDTO from '@/models/DTO/repository';
import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

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
    const params = new URLSearchParams({
      sort: pageContext.sort,
      page: String(nextPage),
    });
    if (pageContext.filter.background) {
      params.set('background', pageContext.filter.background);
    }
    if (pageContext.filter.owner) {
      params.set('owner', pageContext.filter.owner);
    }

    const response = await fetch(`/api/repositories?${params}`);
    const data = await response.json();

    const newRepos = (data.repositories as RepositoryDTO[]).map(
      dto =>
        new Repository({
          ...dto,
          githubCreatedAt: new Date(dto.githubCreatedAt),
          pushedAt: new Date(dto.pushedAt),
        }),
    );

    setRepositories(prev => [...prev, ...newRepos]);
    setPage(nextPage);
    setLoading(false);
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
      {hasMore && (
        <button onClick={loadMore} disabled={loading} className={styles.button}>
          {loading ? 'loading...' : 'load more'}
        </button>
      )}
    </>
  );
}

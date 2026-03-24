'use client';

import { use, useCallback, useState } from 'react';

import RepositoriesClientService from '@/services/repositoriesClient';

import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import RepositoriesGrid from '@/components/repositories/grid';
import LoadMoreButton from '@/components/repositories/loadMoreButton';

type LoadMoreProps = {
  pageContext: PageContext;
  countPromise: Promise<number>;
  initialCountPromise: Promise<number>;
};

export default function LoadMore({
  pageContext,
  countPromise,
  initialCountPromise,
}: LoadMoreProps) {
  const count = use(countPromise);
  const initialCount = use(initialCountPromise);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const renderedCount = initialCount + repositories.length;
  const hasMore = renderedCount < count;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }

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
        <RepositoriesGrid
          repositories={repositories}
          pageContext={pageContext}
        />
      )}
      {hasMore && <LoadMoreButton loading={loading} onClick={loadMore} />}
    </>
  );
}

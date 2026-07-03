import { Suspense } from 'react';

import { RepositoriesService } from '@/services/repositoriesServer';

import { RepositoryDTO } from '@/models/DTO/repository';

import type { PageContext } from '@/lib/pageContext';

import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';
import RepositoriesHeader from '@/components/repositories/header';
import LoadMore from '@/components/repositories/loadMore';
import RepositorySearch from '@/components/repositories/search';

import styles from './index.module.css';

type RepositoriesProps = {
  pageContext: PageContext;
  searchQuery?: string;
};

export default function Repositories({
  pageContext,
  searchQuery,
}: RepositoriesProps) {
  const trimmedSearchQuery = searchQuery?.trim();

  if (trimmedSearchQuery) {
    return (
      <section
        className={styles.container}
        aria-labelledby="repositories-title"
      >
        <RepositorySearch
          pageContext={pageContext}
          query={trimmedSearchQuery}
        />
      </section>
    );
  }

  const repositoriesPromise =
    RepositoriesService.getRepositoryDTOs(pageContext);
  const initialRepositoriesPromise: Promise<RepositoryDTO[]> =
    repositoriesPromise;
  const countPromise = RepositoriesService.getRepositoryCount(
    pageContext.filter,
  );
  return (
    <section className={styles.container} aria-labelledby="repositories-title">
      <Suspense fallback={<RepositoriesHeader title={pageContext.sort} />}>
        <RepositoriesHeaderAsync
          countPromise={countPromise}
          title={pageContext.sort}
        />
      </Suspense>
      <Suspense fallback={<RepositoriesGridSkeleton />}>
        <LoadMore
          pageContext={pageContext}
          initialRepositoriesPromise={initialRepositoriesPromise}
          countPromise={countPromise}
        />
      </Suspense>
    </section>
  );
}

async function RepositoriesHeaderAsync({
  countPromise,
  title,
}: {
  countPromise: Promise<number>;
  title: string;
}) {
  const count = await countPromise;

  return <RepositoriesHeader count={count} title={title} />;
}

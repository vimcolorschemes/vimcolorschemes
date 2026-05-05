import { Suspense } from 'react';

import { RepositoriesService } from '@/services/repositoriesServer';

import { RepositoryDTO } from '@/models/DTO/repository';

import type { PageContext } from '@/lib/pageContext';

import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';
import LoadMore from '@/components/repositories/loadMore';
import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

type RepositoriesProps = {
  pageContext: PageContext;
};

export default function Repositories({ pageContext }: RepositoriesProps) {
  const repositoriesPromise =
    RepositoriesService.getRepositoryDTOs(pageContext);
  const initialRepositoriesPromise: Promise<RepositoryDTO[]> =
    repositoriesPromise;
  const countPromise = RepositoriesService.getRepositoryCount(
    pageContext.filter,
  );
  return (
    <section className={styles.container} aria-labelledby="repositories-title">
      <Suspense fallback={<RepositoriesHeaderFallback />}>
        <RepositoriesHeader countPromise={countPromise} />
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

function RepositoriesHeaderFallback() {
  return (
    <div className={styles.header}>
      <h2 id="repositories-title" className={styles.title}>
        <span className={styles.operator}>❯</span> ls ~/.colors/
        <Skeleton inline className={styles.countSkeleton} />
      </h2>
    </div>
  );
}

async function RepositoriesHeader({
  countPromise,
}: {
  countPromise: Promise<number>;
}) {
  const count = await countPromise;

  return (
    <div className={styles.header}>
      <h2 id="repositories-title" className={styles.title}>
        <span className={styles.operator}>❯</span> ls ~/.colors/
        <span className={styles.count}>
          {count} repositor{count === 1 ? 'y' : 'ies'}
        </span>
      </h2>
    </div>
  );
}

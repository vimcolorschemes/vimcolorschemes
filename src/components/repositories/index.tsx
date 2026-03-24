import { Suspense } from 'react';

import RepositoriesService from '@/services/repositoriesServer';

import RepositoryDTO from '@/models/DTO/repository';

import PageContext from '@/lib/pageContext';

import RepositoriesContent from '@/components/repositories/content';
import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';
import LoadMore from '@/components/repositories/loadMore';

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
    <div className={styles.container}>
      <Suspense fallback={<p>_ repositories</p>}>
        <RepositoriesCount countPromise={countPromise} />
      </Suspense>
      <Suspense fallback={<RepositoriesGridSkeleton />}>
        <RepositoriesContent
          repositoriesPromise={repositoriesPromise}
          pageContext={pageContext}
        />
      </Suspense>
      <Suspense>
        <LoadMore
          pageContext={pageContext}
          initialRepositoriesPromise={initialRepositoriesPromise}
          countPromise={countPromise}
        />
      </Suspense>
    </div>
  );
}

async function RepositoriesCount({
  countPromise,
}: {
  countPromise: Promise<number>;
}) {
  const count = await countPromise;

  return (
    <p>
      {count} repositor{count === 1 ? 'y' : 'ies'}
    </p>
  );
}

import { Suspense } from 'react';

import RepositoriesService from '@/services/repositoriesServer';

import PageContext from '@/lib/pageContext';

import RepositoriesContent from '@/components/repositories/content';
import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';
import LoadMore from '@/components/repositories/loadMore';

import styles from './index.module.css';

type RepositoriesProps = {
  pageContext: PageContext;
};

export default function Repositories({ pageContext }: RepositoriesProps) {
  const repositoriesPromise = RepositoriesService.getRepositories(pageContext);
  const initialCountPromise = repositoriesPromise.then(
    repositories => repositories.length,
  );
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
          countPromise={countPromise}
          initialCountPromise={initialCountPromise}
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

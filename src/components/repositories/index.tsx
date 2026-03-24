import { Suspense } from 'react';

import RepositoriesService from '@/services/repositories';

import PageContext from '@/lib/pageContext';

import RepositoriesGrid from '@/components/repositories/grid';
import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';

import RepositoriesCount from './count';
import styles from './index.module.css';
import LoadMoreWrapper from './loadMoreWrapper';

type RepositoriesProps = {
  pageContext: PageContext;
};

export default function Repositories({ pageContext }: RepositoriesProps) {
  const repositoriesPromise = RepositoriesService.getRepositories(pageContext);
  const countPromise = RepositoriesService.getRepositoryCount(
    pageContext.filter,
  );
  return (
    <div className={styles.container}>
      <Suspense fallback={<p>_ repositories</p>}>
        <RepositoriesCount
          pageContext={pageContext}
          countPromise={countPromise}
        />
      </Suspense>
      <Suspense fallback={<RepositoriesGridSkeleton />}>
        <RepositoriesGrid
          repositoriesPromise={repositoriesPromise}
          pageContext={pageContext}
        />
      </Suspense>
      <Suspense>
        <LoadMoreWrapper
          pageContext={pageContext}
          countPromise={countPromise}
          repositoriesPromise={repositoriesPromise}
        />
      </Suspense>
    </div>
  );
}

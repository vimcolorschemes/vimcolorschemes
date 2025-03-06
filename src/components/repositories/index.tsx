import { Suspense } from 'react';

import PageContext from '@/lib/pageContext';

import Pagination from '@/components/pagination';
import RepositoriesGrid from '@/components/repositories/grid';
import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';

import RepositoriesCount from './count';
import styles from './index.module.css';

type RepositoriesProps = {
  pageContext: PageContext;
};

export default function ResporitoryGrid({ pageContext }: RepositoriesProps) {
  return (
    <div className={styles.container}>
      <Suspense fallback={<p>_ repositories</p>}>
        <RepositoriesCount pageContext={pageContext} />
      </Suspense>
      <Suspense fallback={<RepositoriesGridSkeleton />}>
        <RepositoriesGrid pageContext={pageContext} />
      </Suspense>
      <Suspense>
        <Pagination pageContext={pageContext} />
      </Suspense>
    </div>
  );
}

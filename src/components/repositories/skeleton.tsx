import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';
import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

export default function RepositoryGridSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Skeleton inline className={styles.headerSkeleton} />
      </div>
      <RepositoriesGridSkeleton />
    </div>
  );
}

import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';

import styles from './index.module.css';

export default function RepositoryGridSkeleton() {
  return (
    <div className={styles.container}>
      <p>_ repositories</p>
      <RepositoriesGridSkeleton />
    </div>
  );
}

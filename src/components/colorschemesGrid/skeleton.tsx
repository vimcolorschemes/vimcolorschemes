import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

export default function ColorschemesGridSkeleton() {
  return (
    <div className={styles.container}>
      <Skeleton className={styles.skeleton} />
    </div>
  );
}

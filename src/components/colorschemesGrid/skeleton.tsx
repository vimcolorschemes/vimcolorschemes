import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

export default function ColorschemesGridSkeleton() {
  return (
    <div className={styles.container}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className={styles.skeleton} />
      ))}
    </div>
  );
}

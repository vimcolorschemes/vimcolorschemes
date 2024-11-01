import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

type ColorschemesGridSkeletonProps = {
  count?: number;
};

export default function ColorschemesGridSkeleton({
  count = 20,
}: ColorschemesGridSkeletonProps) {
  const list = Array.from({ length: count });
  return (
    <div className={styles.container}>
      {list.map((_, index) => (
        <Skeleton key={index} className={styles.skeleton} />
      ))}
    </div>
  );
}

import cn from 'classnames';

import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';

import styles from './index.module.css';

type RepositoriesSkeletonProps = {
  title?: string;
};

export default function RepositoryGridSkeleton({
  title,
}: RepositoriesSkeletonProps) {
  return (
    <div className={cn(styles.container, styles.loadingContainer)}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      <RepositoriesGridSkeleton />
    </div>
  );
}

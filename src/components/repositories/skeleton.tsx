import cn from 'classnames';

import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';
import RepositoriesHeader from '@/components/repositories/header';

import styles from './index.module.css';

type RepositoriesSkeletonProps = {
  title?: string;
};

export default function RepositoryGridSkeleton({
  title,
}: RepositoriesSkeletonProps) {
  return (
    <div className={cn(styles.container, styles.loadingContainer)}>
      {title && <RepositoriesHeader title={title} />}
      <RepositoriesGridSkeleton />
    </div>
  );
}

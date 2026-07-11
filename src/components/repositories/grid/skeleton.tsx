import TuiLoading from '@/components/ui/tuiLoading';

import styles from './skeleton.module.css';

type RepositoriesGridSkeletonProps = {
  announce?: boolean;
};

export default function RepositoriesGridSkeleton({
  announce = true,
}: RepositoriesGridSkeletonProps) {
  return (
    <section className={styles.grid}>
      <TuiLoading announce={announce} />
    </section>
  );
}

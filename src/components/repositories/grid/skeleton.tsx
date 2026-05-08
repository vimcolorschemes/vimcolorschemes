import TuiLoading from '@/components/ui/tuiLoading';

import styles from './skeleton.module.css';

export default function RepositoriesGridSkeleton() {
  return (
    <section className={styles.grid}>
      <TuiLoading />
    </section>
  );
}

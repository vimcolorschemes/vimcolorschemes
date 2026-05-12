import RepositoriesSkeleton from '@/components/repositories/skeleton';

import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.homepageContent}>
      <RepositoriesSkeleton />
    </div>
  );
}

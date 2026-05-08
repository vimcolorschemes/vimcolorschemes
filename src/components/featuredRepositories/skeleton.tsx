import RepositoryCardSkeleton from '@/components/repositoryCard/skeleton';
import TuiLoading from '@/components/ui/tuiLoading';

import styles from './index.module.css';

export default function FeaturedRepositoriesSkeleton() {
  return (
    <section className={styles.container} aria-labelledby="featured-title">
      <div className={styles.header}>
        <h2 id="featured-title" className={styles.title}>
          featured
        </h2>
      </div>
      <div className={styles.list}>
        <div className={`${styles.card} ${styles.loadingCard}`}>
          <RepositoryCardSkeleton className={styles.loadingCardSpacer} />
          <TuiLoading className={styles.loadingCardText} />
        </div>
      </div>
    </section>
  );
}

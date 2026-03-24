import Constants from '@/lib/constants';

import RepositoryCardSkeleton from '@/components/repositoryCard/skeleton';

import styles from './skeleton.module.css';

export default function RepositoriesGridSkeleton() {
  return (
    <section className={styles.grid}>
      {Array.from({ length: Constants.REPOSITORY_PAGE_SIZE }).map(
        (_, index) => (
          <RepositoryCardSkeleton key={index} />
        ),
      )}
    </section>
  );
}

import Constants from '@/lib/constants';

import RepositoryCardSkeleton from '../repositoryCard/skeleton';

import styles from './index.module.css';

export default function RepositoryGridSkeleton() {
  return (
    <div className={styles.container}>
      <p>_ repositories</p>
      <section className={styles.grid}>
        {Array.from({ length: Constants.REPOSITORY_PAGE_SIZE }).map(
          (_, index) => (
            <RepositoryCardSkeleton key={index} />
          ),
        )}
      </section>
    </div>
  );
}

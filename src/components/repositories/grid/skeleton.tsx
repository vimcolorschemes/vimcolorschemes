import Constants from '@/lib/constants';

import RepositoryCardSkeleton from '@/components/repositoryCard/skeleton';

import styles from './index.module.css';

export default async function RepositoriesGridSkeleton() {
  return (
    <section className={styles.container}>
      {Array.from({ length: Constants.REPOSITORY_PAGE_SIZE }).map(
        (_, index) => (
          <RepositoryCardSkeleton key={index} />
        ),
      )}
    </section>
  );
}

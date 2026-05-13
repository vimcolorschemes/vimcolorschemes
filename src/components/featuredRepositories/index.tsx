import Link from 'next/link';

import { RepositoriesService } from '@/services/repositoriesServer';

import type { PageContext } from '@/lib/pageContext';

import RepositoryCard from '@/components/repositoryCard';
import TuiLoading from '@/components/ui/tuiLoading';

import styles from './index.module.css';

type FeaturedRepositoriesProps = {
  pageContext: PageContext;
};

export default async function FeaturedRepositories({
  pageContext,
}: FeaturedRepositoriesProps) {
  const repositories = await RepositoriesService.getFeaturedRepositoryDTOs();

  if (!repositories.length) {
    return null;
  }

  return (
    <section className={styles.container} aria-labelledby="featured-title">
      <div className={styles.header}>
        <h2 id="featured-title" className={styles.title}>
          featured
        </h2>
        <Link href="/about#featured" prefetch={false} className={styles.cta}>
          get featured
        </Link>
      </div>
      <div className={styles.list}>
        {repositories.map(repositoryDTO => (
          <RepositoryCard
            key={`${repositoryDTO.owner.name}/${repositoryDTO.name}`}
            repositoryDTO={repositoryDTO}
            pageContext={pageContext}
            className={styles.card}
            headingLevel="h3"
          />
        ))}
      </div>
    </section>
  );
}

export function FeaturedRepositoriesSkeleton() {
  return (
    <section className={styles.container} aria-labelledby="featured-title">
      <div className={styles.header}>
        <h2 id="featured-title" className={styles.title}>
          featured
        </h2>
      </div>
      <div className={styles.loadingList}>
        <TuiLoading />
      </div>
    </section>
  );
}

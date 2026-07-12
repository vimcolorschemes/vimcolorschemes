import { RepositoryDTO } from '@/models/DTO/repository';

import type { PageContext } from '@/lib/pageContext';

import { PageContextHelper } from '@/helpers/pageContext';

import RepositoryCard from '@/components/repositoryCard';

import styles from './index.module.css';

type RepositoriesGridProps = {
  repositories: RepositoryDTO[];
  pageContext: PageContext;
  searchQuery?: string;
};

export default function RepositoriesGrid({
  repositories,
  pageContext,
  searchQuery,
}: RepositoriesGridProps) {
  const cardClassName = PageContextHelper.isHomepage(pageContext)
    ? styles.homepageCard
    : undefined;

  return (
    <section className={styles.container}>
      {repositories.map(repository => (
        <RepositoryCard
          key={`${repository.owner.name}/${repository.name}`}
          repositoryDTO={repository}
          pageContext={pageContext}
          searchQuery={searchQuery}
          className={cardClassName}
        />
      ))}
    </section>
  );
}

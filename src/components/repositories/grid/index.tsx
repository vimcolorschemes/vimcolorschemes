import RepositoryDTO from '@/models/DTO/repository';

import PageContext from '@/lib/pageContext';

import RepositoryCard from '@/components/repositoryCard';

import styles from './index.module.css';

type RepositoriesGridProps = {
  repositories: RepositoryDTO[];
  pageContext: PageContext;
};

export default function RepositoriesGrid({
  repositories,
  pageContext,
}: RepositoriesGridProps) {
  return (
    <section className={styles.container}>
      {repositories.map(repository => (
        <RepositoryCard
          key={`${repository.owner.name}/${repository.name}`}
          repositoryDTO={repository}
          pageContext={pageContext}
        />
      ))}
    </section>
  );
}

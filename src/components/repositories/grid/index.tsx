import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import RepositoryCard from '@/components/repositoryCard';

import styles from './index.module.css';

type RepositoriesGridProps = {
  repositories: Repository[];
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
          key={repository.key}
          repository={repository}
          pageContext={pageContext}
        />
      ))}
    </section>
  );
}

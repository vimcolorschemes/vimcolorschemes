import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import RepositoryCard from '@/components/repositoryCard';

import styles from './index.module.css';

type RepositoriesGridProps = {
  repositoriesPromise: Promise<Repository[]>;
  pageContext: PageContext;
};

export default async function RepositoriesGrid({
  repositoriesPromise,
  pageContext,
}: RepositoriesGridProps) {
  const repositories = await repositoriesPromise;
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

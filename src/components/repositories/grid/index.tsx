import RepositoriesService from '@/services/repositories';

import PageContext from '@/lib/pageContext';

import RepositoryCard from '@/components/repositoryCard';

import styles from './index.module.css';

type RepositoriesGridProps = {
  pageContext: PageContext;
};

export default async function RepositoriesGrid({
  pageContext,
}: RepositoriesGridProps) {
  const repositories = await RepositoriesService.getRepositories(pageContext);
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

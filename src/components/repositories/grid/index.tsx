import RepositoriesService from '@/services/repositories';

import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import RepositoryCard from '@/components/repositoryCard';

import styles from './index.module.css';

type RepositoriesGridProps = {
  pageContext: PageContext;
};

export default async function RepositoriesGrid({
  pageContext,
}: RepositoriesGridProps) {
  const dtos = await RepositoriesService.getRepositories(pageContext);
  const repositories = dtos.map(dto => new Repository(dto));
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

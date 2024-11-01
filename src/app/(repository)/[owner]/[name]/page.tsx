import { Metadata } from 'next';

import RepositoriesService from '@/services/repositories';

import ColorschemesGrid from '@/components/colorschemesGrid';
import RepositoryPageHeader from '@/components/repositoryPageHeader';
import RepositoryTitle from '@/components/repositoryTitle';

import styles from './page.module.css';

type RepositoryPageProps = { params: { owner: string; name: string } };

export async function generateMetadata({
  params,
}: RepositoryPageProps): Promise<Metadata> {
  const repository = await RepositoriesService.getRepository(
    params.owner,
    params.name,
  );

  if (!repository) {
    return {};
  }

  return { title: repository.title };
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const repository = await RepositoriesService.getRepository(
    params.owner,
    params.name,
  );

  if (!repository) {
    return (
      <p className={styles.notFound}>
        <strong>404: </strong>
        repository{' '}
        <strong>
          {params.owner}/{params.name}
        </strong>{' '}
        not found.
      </p>
    );
  }

  return (
    <>
      <RepositoryPageHeader repositoryKey={repository.key} />
      <RepositoryTitle repository={repository} />
      <p className={styles.description}>{repository.description}</p>
      <ColorschemesGrid colorschemes={repository.flattenedColorschemes} />
    </>
  );
}

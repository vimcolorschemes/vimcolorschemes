import { Metadata } from 'next';

import RepositoriesService from '@/services/repositories';

import ColorschemesGrid from '@/components/colorschemesGrid';
import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryPageHeader from '@/components/repositoryPageHeader';
import RepositoryTitle from '@/components/repositoryTitle';

import styles from './page.module.css';

type RepositoryPageProps = { params: Promise<{ owner: string; name: string }> };

export async function generateMetadata({
  params,
}: RepositoryPageProps): Promise<Metadata> {
  const { owner, name } = await params;
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    return {};
  }

  return { title: repository.title };
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const { owner, name } = await params;
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    return (
      <p className={styles.notFound}>
        <strong>404: </strong>
        repository{' '}
        <strong>
          {owner}/{name}
        </strong>{' '}
        not found.
      </p>
    );
  }

  return (
    <>
      <RepositoryPageHeader repositoryKey={repository.key} />
      <RepositoryTitle repository={repository} />
      <RepositoryInfo repository={repository} />
      <ColorschemesGrid colorschemes={repository.flattenedColorschemes} />
    </>
  );
}

import { Metadata } from 'next';

import RepositoriesService from '@/services/repositories';

import ColorschemesGrid from '@/components/colorschemesGrid';
import RepositoryNotFound from '@/components/repositoryNotFound';
import RepositoryPageHeader from '@/components/repositoryPageHeader';
import RepositoryTitle from '@/components/repositoryTitle';
import Header from '@/components/ui/header';

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
      <>
        <Header />
        <RepositoryNotFound key={`${params.owner}/${params.name}`} />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <RepositoryPageHeader repositoryKey={repository.key} />
        <RepositoryTitle repository={repository} />
        <p>{repository.description}</p>
        <ColorschemesGrid colorschemes={repository.flattenedColorschemes} />
      </main>
    </>
  );
}

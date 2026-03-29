import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RepositoriesService } from '@/services/repositoriesServer';

import ColorschemesGrid from '@/components/colorschemesGrid';
import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryPageHeader from '@/components/repositoryPageHeader';
import RepositoryTitle from '@/components/repositoryTitle';

import styles from './page.module.css';

export const dynamicParams = false;

export async function generateStaticParams() {
  const keys = await RepositoriesService.getAllRepositoryKeys();
  return keys.map(k => ({
    owner: k.ownerName.toLowerCase(),
    name: k.name.toLowerCase(),
  }));
}

type RepositoryPageProps = { params: Promise<{ owner: string; name: string }> };

export async function generateMetadata({
  params,
}: RepositoryPageProps): Promise<Metadata> {
  const { owner, name } = await params;
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    return { title: 'Repository not found' };
  }

  return { title: repository.title };
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const { owner, name } = await params;
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    notFound();
  }

  return (
    <>
      <RepositoryPageHeader repositoryKey={repository.key} />
      <RepositoryTitle
        repository={repository}
        hasOwnerLink
        classNames={{ container: styles.pageWidth }}
      />
      <RepositoryInfo repository={repository} className={styles.pageWidth} />
      <ColorschemesGrid colorschemes={repository.flattenedColorschemes} />
    </>
  );
}

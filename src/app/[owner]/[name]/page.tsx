import { Metadata } from 'next';

import { RepositoriesService } from '@/services/repositoriesServer';

import RepositoryPageContent from '@/components/repositoryPageContent';

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
  return (
    <div className={`${styles.page} repositoryDetailsPage`}>
      <RepositoryPageContent owner={owner} name={name} />
    </div>
  );
}

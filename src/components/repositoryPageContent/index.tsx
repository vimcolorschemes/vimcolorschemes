import { notFound } from 'next/navigation';

import { RepositoriesService } from '@/services/repositoriesServer';

import RepositoryPageContentView from './content';

type RepositoryPageContentProps = {
  owner: string;
  name: string;
};

export default async function RepositoryPageContent({
  owner,
  name,
}: RepositoryPageContentProps) {
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    notFound();
  }

  return <RepositoryPageContentView repository={repository} />;
}

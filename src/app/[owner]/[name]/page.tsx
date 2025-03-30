import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import RepositoriesService from '@/services/repositories';

import Repository from '@/models/repository';

import ColorschemesGrid from '@/components/colorschemesGrid';
import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryPageHeader from '@/components/repositoryPageHeader';
import RepositoryTitle from '@/components/repositoryTitle';

type RepositoryPageProps = { params: Promise<{ owner: string; name: string }> };

export async function generateMetadata({
  params,
}: RepositoryPageProps): Promise<Metadata> {
  const { owner, name } = await params;
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    return { title: 'Repository not found' };
  }

  return { title: `${repository.name}, by ${repository.owner.name}` };
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const { owner, name } = await params;
  const dto = await RepositoriesService.getRepository(owner, name);
  if (!dto) {
    notFound();
  }

  const repository = new Repository(dto);
  return (
    <>
      <RepositoryPageHeader repositoryKey={repository.key} />
      <RepositoryTitle repository={repository} hasOwnerLink />
      <RepositoryInfo repository={repository} />
      <ColorschemesGrid colorschemes={repository.flattenedColorschemes} />
    </>
  );
}

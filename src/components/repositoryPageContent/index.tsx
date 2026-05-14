import { notFound } from 'next/navigation';

import { RepositoriesService } from '@/services/repositoriesServer';

import { RepositoryPageHelper } from '@/helpers/repositoryPage';

import RepositoryPageContentView from './content';

type RepositoryPageContentProps = {
  owner: string;
  name: string;
  variantSearchParams?: {
    colorscheme?: string | string[] | null;
    background?: string | string[] | null;
  };
};

export default async function RepositoryPageContent({
  owner,
  name,
  variantSearchParams = {},
}: RepositoryPageContentProps) {
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    notFound();
  }

  const initialVariantIndex =
    RepositoryPageHelper.getVariantIndexFromSearchParams(
      repository.flattenedColorschemes,
      variantSearchParams,
    );

  return (
    <RepositoryPageContentView
      repository={repository}
      initialVariantIndex={initialVariantIndex}
    />
  );
}

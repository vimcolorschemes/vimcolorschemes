import { notFound } from 'next/navigation';

import { RepositoriesService } from '@/services/repositoriesServer';

import { Background, Backgrounds } from '@/lib/backgrounds';

import { RepositoryPageHelper } from '@/helpers/repositoryPage';

import RepositoryPageContentView from './content';

type RepositoryPageContentProps = {
  owner: string;
  name: string;
  colorscheme?: string;
  background?: string;
};

export default async function RepositoryPageContent({
  owner,
  name,
  colorscheme,
  background,
}: RepositoryPageContentProps) {
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    notFound();
  }

  const initialVariantIndex = RepositoryPageHelper.getVariantIndex(
    repository.flattenedColorschemes,
    colorscheme,
    getBackground(background),
  );

  return (
    <RepositoryPageContentView
      repository={repository}
      initialVariantIndex={initialVariantIndex}
    />
  );
}

function getBackground(value: string | undefined): Background | undefined {
  if (value === Backgrounds.Dark || value === Backgrounds.Light) {
    return value;
  }

  return undefined;
}

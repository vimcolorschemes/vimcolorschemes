import { notFound } from 'next/navigation';

import { RepositoriesService } from '@/services/repositoriesServer';

import { Background, Backgrounds } from '@/lib/backgrounds';

import { RepositoryPageHelper } from '@/helpers/repositoryPage';

import RepositoryPageContentView from '@/components/repositoryPageContent/content';
import RepositoryPageModal from '@/components/repositoryPageModal';

export const dynamicParams = false;

export { generateMetadata } from '@/app/[owner]/[name]/page';

export async function generateStaticParams() {
  const keys = await RepositoriesService.getAllRepositoryKeys();
  return keys.map(k => ({
    owner: k.ownerName.toLowerCase(),
    name: k.name.toLowerCase(),
  }));
}

type RepositoryPageModalRouteProps = {
  params: Promise<{ owner: string; name: string }>;
  searchParams: Promise<{ colorscheme?: string; background?: string }>;
};

export default async function RepositoryPageModalRoute({
  params,
  searchParams,
}: RepositoryPageModalRouteProps) {
  const { owner, name } = await params;
  const { colorscheme, background } = await searchParams;
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    notFound();
  }

  const variants = repository.flattenedColorschemes;
  const initialVariantIndex = RepositoryPageHelper.getVariantIndex(
    variants,
    colorscheme,
    getBackground(background),
  );
  const themeStyle = RepositoryPageHelper.getColorschemeStyle(
    variants[initialVariantIndex],
  );

  return (
    <RepositoryPageModal themeStyle={themeStyle}>
      <RepositoryPageContentView
        repository={repository}
        initialVariantIndex={initialVariantIndex}
      />
    </RepositoryPageModal>
  );
}

function getBackground(value: string | undefined): Background | undefined {
  if (value === Backgrounds.Dark || value === Backgrounds.Light) {
    return value;
  }

  return undefined;
}

import { notFound } from 'next/navigation';

import { RepositoriesService } from '@/services/repositoriesServer';

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
};

export default async function RepositoryPageModalRoute({
  params,
}: RepositoryPageModalRouteProps) {
  const { owner, name } = await params;
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    notFound();
  }

  const themeStyle = RepositoryPageHelper.getColorschemeStyle(
    repository.flattenedColorschemes[0],
  );

  return (
    <RepositoryPageModal themeStyle={themeStyle}>
      <RepositoryPageContentView repository={repository} />
    </RepositoryPageModal>
  );
}

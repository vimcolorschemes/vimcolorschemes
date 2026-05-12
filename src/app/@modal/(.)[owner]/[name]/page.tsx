import { RepositoriesService } from '@/services/repositoriesServer';

import RepositoryPageContent from '@/components/repositoryPageContent';
import RepositoryPageModal from '@/components/repositoryPageModal';

export const dynamicParams = false;

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
  await new Promise(resolve => setTimeout(resolve, 5000));

  const { owner, name } = await params;

  return (
    <RepositoryPageModal>
      <RepositoryPageContent owner={owner} name={name} />
    </RepositoryPageModal>
  );
}

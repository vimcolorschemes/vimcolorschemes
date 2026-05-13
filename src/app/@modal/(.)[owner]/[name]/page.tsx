import { RepositoriesService } from '@/services/repositoriesServer';

import RepositoryPageContent from '@/components/repositoryPageContent';
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

  return (
    <RepositoryPageModal>
      <RepositoryPageContent owner={owner} name={name} />
    </RepositoryPageModal>
  );
}

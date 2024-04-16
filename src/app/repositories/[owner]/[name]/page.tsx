import { Metadata } from 'next';

import RepositoriesService from '@/services/repositories';

type RepositoryPageProps = {
  params: {
    owner: string;
    name: string;
  };
};

export async function generateMetadata({
  params,
}: RepositoryPageProps): Promise<Metadata> {
  const repository = await RepositoriesService.getRepository(
    params.owner,
    params.name,
  );

  return { title: `${repository.title} | vimcolorschemes` };
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const repository = await RepositoriesService.getRepository(
    params.owner,
    params.name,
  );

  return <main>{repository.key}</main>;
}

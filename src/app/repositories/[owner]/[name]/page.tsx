import { Metadata } from 'next';

import RepositoriesService from '@/services/repositories';

import Preview from '@/components/preview';

type RepositoryPageProps = { params: { owner: string; name: string } };

export async function generateMetadata({
  params,
}: RepositoryPageProps): Promise<Metadata> {
  const repository = await RepositoriesService.getRepository(
    params.owner,
    params.name,
  );

  return { title: repository.title };
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const repository = await RepositoriesService.getRepository(
    params.owner,
    params.name,
  );

  return (
    <main>
      <h1>{repository.key}</h1>
      {repository.flattenedColorschemes.map((colorscheme, index) => (
        <Preview
          key={index}
          colorscheme={colorscheme}
          background={colorscheme.backgrounds[0]}
        />
      ))}
    </main>
  );
}

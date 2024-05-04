import { Metadata } from 'next';

import RepositoriesService from '@/services/repositories';

import Preview from '@/components/preview';
import Header from '@/components/ui/header';

import styles from './page.module.css';

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
    <>
      <Header />
      <main className={styles.container}>
        <h1>{repository.key}</h1>
        {repository.flattenedColorschemes.map((colorscheme, index) => (
          <Preview
            key={index}
            colorscheme={colorscheme}
            background={colorscheme.backgrounds[0]}
          />
        ))}
      </main>
    </>
  );
}

import { Metadata } from 'next';

import RepositoriesService from '@/services/repositories';

import Preview from '@/components/preview';
import RepositoryTitle from '@/components/repositoryTitle';
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
        <RepositoryTitle repository={repository} />
        <p>{repository.description}</p>
        {repository.flattenedColorschemes.length > 1 && (
          <p>
            {repository.flattenedColorschemes.length} colorscheme variations
          </p>
        )}
        <div className={styles.repositories}>
          {repository.flattenedColorschemes.map((colorscheme, index) => (
            <Preview
              key={index}
              colorscheme={colorscheme}
              background={colorscheme.backgrounds[0]}
            />
          ))}
        </div>
      </main>
    </>
  );
}

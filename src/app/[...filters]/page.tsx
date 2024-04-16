import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import Sort, { SortOptionMap, SortOptions } from '@/lib/sort';
import RepositoriesService from '@/services/repositories';

import styles from './page.module.css';

type IndexPageProps = {
  params: {
    filters: string[];
  };
};

export const metadata: Metadata = { title: 'Home | vimcolorschemes' };

export default async function IndexPage({ params }: IndexPageProps) {
  const sort = SortOptionMap[params.filters[0]];
  if (sort == null) {
    redirect(`/${SortOptions.Top}`);
  }

  const repositories = await RepositoriesService.getRepositories({ sort });

  return (
    <main className={styles.container}>
      <ul>
        {repositories.map(repository => (
          <li key={repository.key}>
            <Link href={repository.route}>
              <p>
                {repository.title} ({repository.stargazersCount})
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function getSort(value: string): Sort | null {
  return SortOptionMap[value] || null;
}

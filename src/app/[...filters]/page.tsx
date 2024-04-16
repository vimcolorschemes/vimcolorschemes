import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import FiltersHelper from '@/helpers/filters';
import { SortOptionMap, SortOptions } from '@/lib/sort';
import RepositoriesService from '@/services/repositories';

import styles from './page.module.css';

type IndexPageProps = {
  params: {
    filters: string[];
  };
};

export const metadata: Metadata = { title: 'Home | vimcolorschemes' };

export default async function IndexPage({ params }: IndexPageProps) {
  const [sortOption, ...filters] = params.filters;

  const sort = SortOptionMap[sortOption];
  if (sort == null) {
    redirect(`/${SortOptions.Top}`);
  }

  const filter = FiltersHelper.getFilter(filters);

  const repositories = await RepositoriesService.getRepositories({
    sort,
    filter,
  });

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

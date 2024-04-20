import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import FilterHelper from '@/helpers/filter';
import Sort, { SortOptions } from '@/lib/sort';
import RepositoriesService from '@/services/repositories';

import Search from '@/components/search';

import styles from './page.module.css';

type IndexPageProps = {
  params: {
    filters: string[];
  };
};

export const metadata: Metadata = { title: 'Home | vimcolorschemes' };

export default async function IndexPage({ params }: IndexPageProps) {
  const [sort, ...filters] = params.filters;

  if (!Object.values(SortOptions).includes(sort as Sort)) {
    redirect(`/${SortOptions.Trending}`);
  }

  const filter = FilterHelper.getFilterFromURL(filters);
  const validURL = FilterHelper.getURLFromFilter(filter);
  if (validURL !== filters.join('/')) {
    redirect(`/${sort}/${validURL}`);
  }

  const repositories = await RepositoriesService.getRepositories({
    sort: sort as Sort,
    filter,
  });

  return (
    <main className={styles.container}>
      <Search />
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

import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';
import IndexPageContext from '@/lib/indexPageContext';
import Sort, { SortOptions } from '@/lib/sort';
import RepositoriesService from '@/services/repositories';

import BackgroundInput from '@/components/backgroundInput';
import EngineInput from '@/components/engineInput';
import RepositoryCard from '@/components/repositoryCard';
import SearchInput from '@/components/searchInput';
import SortInput from '@/components/sortInput';

import styles from './page.module.css';

type IndexPageProps = {
  params: {
    filters: string[];
  };
};

export const metadata: Metadata = { title: 'Home | vimcolorschemes' };

export default async function IndexPage({ params }: IndexPageProps) {
  const [sort, ...filters] = params.filters as [Sort, ...string[]];
  const pageContext = PageContextHelper.get(params.filters);

  const validURL = FilterHelper.getURLFromFilter(pageContext.filter);
  if (validURL !== filters.join('/')) {
    redirect(`/${sort}/${validURL}`);
  }

  const repositories = await RepositoriesService.getRepositories(pageContext);

  return (
    <main className={styles.container}>
      <SearchInput />
      <SortInput pageContext={pageContext} />
      <BackgroundInput />
      <EngineInput />
      <ul className={styles.grid}>
        {repositories.map(repository => (
          <li key={repository.key}>
            <Link href={repository.route}>
              <RepositoryCard repository={repository} />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

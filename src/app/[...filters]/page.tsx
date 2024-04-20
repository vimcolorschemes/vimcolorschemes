import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';
import Sort from '@/lib/sort';
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

export async function generateMetadata({
  params,
}: IndexPageProps): Promise<Metadata> {
  const pageContext = PageContextHelper.get(params.filters);
  return { title: PageContextHelper.getPageTitle(pageContext) };
}

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
      <section className={styles.grid}>
        {repositories.map(repository => (
          <Link href={repository.route} key={repository.key}>
            <RepositoryCard repository={repository} />
          </Link>
        ))}
      </section>
    </main>
  );
}

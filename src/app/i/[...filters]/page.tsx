import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import Sort, { SortOptions } from '@/lib/sort';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import Filters from '@/components/filters';
import RepositoryGrid from '@/components/repositoryGrid';
import Header from '@/components/ui/header';

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

  if (!Object.values(SortOptions).includes(sort)) {
    redirect(`/i/${SortOptions.Trending}/${validURL}`);
  }

  if (validURL !== filters.join('/')) {
    redirect(`/i/${sort}/${validURL}`);
  }

  return (
    <>
      <Header pageContext={pageContext} />
      <main className={styles.container}>
        <Filters />
        <Suspense fallback={<div>Loading...</div>}>
          <RepositoryGrid pageContext={pageContext} />
        </Suspense>
      </main>
    </>
  );
}

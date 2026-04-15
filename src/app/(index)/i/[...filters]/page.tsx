import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { Backgrounds } from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';
import type { Sort } from '@/lib/sort';
import { SortOptions } from '@/lib/sort';

import { FilterHelper } from '@/helpers/filter';
import { buildIndexRoutePath } from '@/helpers/indexRoute';
import { PageContextHelper } from '@/helpers/pageContext';

import FeaturedRepositories from '@/components/featuredRepositories';
import Repositories from '@/components/repositories';

import styles from './page.module.css';

export const dynamicParams = true;

export function generateStaticParams() {
  const sorts = Object.values(SortOptions);
  const backgrounds: (BackgroundFilter | undefined)[] = [
    undefined,
    Backgrounds.Dark,
    Backgrounds.Light,
    'both',
  ];

  return sorts.flatMap(sort =>
    backgrounds.map(background => {
      const filterURL = FilterHelper.getURLFromFilter(
        background ? { background } : {},
      );
      const filters = filterURL ? [sort, filterURL] : [sort];
      return { filters };
    }),
  );
}

type IndexPageProps = { params: Promise<{ filters: string[] }> };

export async function generateMetadata({
  params,
}: IndexPageProps): Promise<Metadata> {
  const { filters } = await params;
  const pageContext = PageContextHelper.get(filters);

  return {
    title: PageContextHelper.getPageTitle(pageContext),
  };
}

export default async function IndexPage({ params }: IndexPageProps) {
  const { filters } = await params;
  const [sort, ...rest] = filters as [Sort, ...string[]];
  const pageContext = PageContextHelper.get(filters);
  const isHomepage = PageContextHelper.isHomepage(pageContext);

  const validURL = FilterHelper.getURLFromFilter(pageContext.filter);

  if (!Object.values(SortOptions).includes(sort)) {
    redirect(
      buildIndexRoutePath({
        sort: SortOptions.Trending,
        filter: pageContext.filter,
      }),
    );
  }

  if (validURL !== rest.join('/')) {
    redirect(buildIndexRoutePath(pageContext));
  }

  return (
    <div className={styles.homepageContent}>
      {isHomepage && (
        <Suspense>
          <FeaturedRepositories />
        </Suspense>
      )}
      <Repositories pageContext={pageContext} />
    </div>
  );
}

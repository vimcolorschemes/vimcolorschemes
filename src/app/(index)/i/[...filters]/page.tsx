import cn from 'classnames';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import type { Sort } from '@/lib/sort';
import { SortOptions } from '@/lib/sort';

import { FilterHelper } from '@/helpers/filter';
import {
  buildIndexRoutePath,
  buildIndexRouteStaticParams,
} from '@/helpers/indexRoute';
import { PageContextHelper } from '@/helpers/pageContext';

import FeaturedRepositories, {
  FeaturedRepositoriesSkeleton,
} from '@/components/featuredRepositories';
import Repositories from '@/components/repositories';

import styles from './page.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return buildIndexRouteStaticParams();
}

type IndexPageProps = { params: Promise<{ filters: string[] }> };
type IndexPageSearchParams = Promise<{
  q?: string | string[] | undefined;
}>;

export async function generateMetadata({
  params,
}: IndexPageProps): Promise<Metadata> {
  const { filters } = await params;
  const pageContext = PageContextHelper.get(filters);

  return {
    title: PageContextHelper.getPageTitle(pageContext),
  };
}

export default async function IndexPage({
  params,
  searchParams,
}: IndexPageProps & { searchParams: IndexPageSearchParams }) {
  const { filters } = await params;
  const searchQuery = getSearchQuery(await searchParams);
  const [sort, ...rest] = filters as [Sort, ...string[]];
  const pageContext = PageContextHelper.get(filters);
  const isHomepage = PageContextHelper.isHomepage(pageContext);
  const showFeaturedRepositories = isHomepage && !searchQuery;

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
    <div
      className={cn(styles.homepageContent, {
        [styles.homepageContentWithFeatured]: showFeaturedRepositories,
      })}
    >
      {showFeaturedRepositories && (
        <Suspense fallback={<FeaturedRepositoriesSkeleton />}>
          <FeaturedRepositories pageContext={pageContext} />
        </Suspense>
      )}
      <Repositories pageContext={pageContext} searchQuery={searchQuery} />
    </div>
  );
}

function getSearchQuery(
  searchParams: Awaited<IndexPageSearchParams>,
): string | undefined {
  const value = Array.isArray(searchParams.q)
    ? searchParams.q[0]
    : searchParams.q;
  const trimmedValue = value?.trim();

  return trimmedValue || undefined;
}

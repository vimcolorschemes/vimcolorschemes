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
    <div
      className={cn(styles.homepageContent, {
        [styles.homepageContentWithFeatured]: isHomepage,
      })}
    >
      {isHomepage && (
        <Suspense fallback={<FeaturedRepositoriesSkeleton />}>
          <FeaturedRepositories pageContext={pageContext} />
        </Suspense>
      )}
      <Repositories pageContext={pageContext} />
    </div>
  );
}

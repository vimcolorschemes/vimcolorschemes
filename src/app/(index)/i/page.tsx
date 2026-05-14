import cn from 'classnames';
import { Metadata } from 'next';
import { Suspense } from 'react';

import { PageContextHelper } from '@/helpers/pageContext';

import FeaturedRepositories, {
  FeaturedRepositoriesSkeleton,
} from '@/components/featuredRepositories';
import Repositories from '@/components/repositories';

import styles from './page.module.css';

type IndexPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: IndexPageProps): Promise<Metadata> {
  const pageContext = PageContextHelper.getFromSearchParams(await searchParams);

  return {
    title: PageContextHelper.getPageTitle(pageContext),
  };
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
  const pageContext = PageContextHelper.getFromSearchParams(await searchParams);
  const isHomepage = PageContextHelper.isHomepage(pageContext);

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

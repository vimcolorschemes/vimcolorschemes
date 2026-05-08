'use client';

import { ReactNode } from 'react';

import { PageContextHelper } from '@/helpers/pageContext';

import FeaturedRepositoriesSkeleton from '@/components/featuredRepositories/skeleton';
import { useIndexPending } from '@/components/providers/indexPendingProvider';
import RepositoriesSkeleton from '@/components/repositories/skeleton';

import styles from './index.module.css';

export default function IndexPendingBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const { isPending, pageContext } = useIndexPending();
  const showFeatured = PageContextHelper.isHomepage(pageContext);

  if (isPending) {
    return (
      <div className={styles.loadingPage}>
        {showFeatured && <FeaturedRepositoriesSkeleton />}
        <RepositoriesSkeleton title={pageContext.sort} />
      </div>
    );
  }

  return <>{children}</>;
}

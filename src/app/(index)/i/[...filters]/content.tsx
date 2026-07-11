'use client';

import cn from 'classnames';
import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

import type { PageContext } from '@/lib/pageContext';

import RepositorySearch from '@/components/repositories/search';

import styles from './page.module.css';

type IndexPageContentProps = {
  children: ReactNode;
  isHomepage: boolean;
  pageContext: PageContext;
};

export default function IndexPageContent({
  children,
  isHomepage,
  pageContext,
}: IndexPageContentProps) {
  const searchQuery = useSearchParams().get('q')?.trim();

  return (
    <div
      className={cn(styles.homepageContent, {
        [styles.homepageContentWithFeatured]: isHomepage && !searchQuery,
      })}
    >
      {searchQuery ? (
        <RepositorySearch pageContext={pageContext} query={searchQuery} />
      ) : (
        children
      )}
    </div>
  );
}

'use client';

import cn from 'classnames';
import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

import type { PageContext } from '@/lib/pageContext';

import styles from './page.module.css';
import IndexPageSearchContent from './searchContent';

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
        <IndexPageSearchContent pageContext={pageContext} query={searchQuery} />
      ) : (
        children
      )}
    </div>
  );
}

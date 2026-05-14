import { ReactNode, Suspense } from 'react';

import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import ExploreCommandInput from '@/components/exploreCommandInput';
import ExploreCommand from '@/components/exploreCommandInput/command';
import Header from '@/components/ui/header';

import styles from './layout.module.css';

const fallbackPageContext: PageContext = {
  sort: SortOptions.Trending,
  filter: {},
};

type IndexPageLayoutProps = {
  children: ReactNode;
};

export default function IndexPageLayout({ children }: IndexPageLayoutProps) {
  return (
    <div className={styles.viewport}>
      <Header>
        <Suspense
          fallback={
            <ExploreCommand
              interactive={false}
              pageContext={fallbackPageContext}
            />
          }
        >
          <ExploreCommandInput fallbackPageContext={fallbackPageContext} />
        </Suspense>
      </Header>
      <main className={styles.container}>{children}</main>
    </div>
  );
}

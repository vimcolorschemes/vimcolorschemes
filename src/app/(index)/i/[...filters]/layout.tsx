import { ReactNode, Suspense } from 'react';

import { PageContextHelper } from '@/helpers/pageContext';

import ExploreCommandInput from '@/components/exploreCommandInput';
import ExploreCommand from '@/components/exploreCommandInput/command';
import IndexPendingBoundary from '@/components/indexPendingBoundary';
import IndexPendingProvider from '@/components/providers/indexPendingProvider';
import Header from '@/components/ui/header';

import styles from './layout.module.css';

type IndexPageLayoutProps = {
  children: ReactNode;
  params: Promise<{ filters: string[] }>;
};

export default async function IndexPageLayout({
  children,
  params,
}: IndexPageLayoutProps) {
  const { filters } = await params;
  const pageContext = PageContextHelper.get(filters);

  return (
    <IndexPendingProvider>
      <Header showBranding={false}>
        <Suspense
          fallback={
            <ExploreCommand interactive={false} pageContext={pageContext} />
          }
        >
          <ExploreCommandInput />
        </Suspense>
      </Header>
      <main className={styles.container}>
        <IndexPendingBoundary>{children}</IndexPendingBoundary>
      </main>
    </IndexPendingProvider>
  );
}

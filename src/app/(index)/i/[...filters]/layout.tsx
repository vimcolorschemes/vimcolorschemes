import { ReactNode, Suspense } from 'react';

import { Backgrounds } from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import { PageContextHelper } from '@/helpers/pageContext';

import ExploreCommandInput from '@/components/exploreCommandInput';
import commandStyles from '@/components/exploreCommandInput/index.module.css';
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
          fallback={<ExploreCommandInputFallback pageContext={pageContext} />}
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

function ExploreCommandInputFallback({
  pageContext,
}: {
  pageContext: PageContext;
}) {
  const options: { value: BackgroundFilter | undefined; label: string }[] = [
    { value: undefined, label: 'any' },
    { value: Backgrounds.Dark, label: 'dark' },
    { value: Backgrounds.Light, label: 'light' },
    { value: 'both', label: 'both' },
  ];

  return (
    <div className={commandStyles.container} aria-hidden="true">
      <span className={commandStyles.prompt}>~/vimcolorschemes</span>
      <span className={commandStyles.operator}>❯</span>
      <span className={commandStyles.command}>explore</span>
      <span className={commandStyles.flag}>--sort</span>
      <span className={commandStyles.group}>
        {Object.values(SortOptions).map((option, index) => (
          <span key={option} className={commandStyles.segment}>
            {index > 0 && <span className={commandStyles.pipe}>|</span>}
            <span
              className={`${commandStyles.option}${pageContext.sort === option ? ` ${commandStyles.active}` : ''}`}
            >
              {option}
            </span>
          </span>
        ))}
      </span>
      <span className={commandStyles.flag}>--background</span>
      <span className={commandStyles.group}>
        {options.map((option, index) => (
          <span key={option.label} className={commandStyles.segment}>
            {index > 0 && <span className={commandStyles.pipe}>|</span>}
            <span
              className={`${commandStyles.option}${pageContext.filter.background === option.value ? ` ${commandStyles.active}` : ''}`}
            >
              {option.label}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}

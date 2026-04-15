import { ReactNode, Suspense } from 'react';

import { Backgrounds } from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import { PageContextHelper } from '@/helpers/pageContext';

import BackgroundInput from '@/components/backgroundInput';
import IndexPendingBoundary from '@/components/indexPendingBoundary';
import IndexPendingProvider from '@/components/providers/indexPendingProvider';
import SortInput from '@/components/sortInput';
import sortInputStyles from '@/components/sortInput/index.module.css';
import Header from '@/components/ui/header';
import radioStyles from '@/components/ui/radio/index.module.css';

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
      <Header>
        <Suspense fallback={<SortInputFallback pageContext={pageContext} />}>
          <SortInput />
        </Suspense>
      </Header>
      <main className={styles.container}>
        <div className={styles.inputs}>
          <Suspense
            fallback={<BackgroundInputFallback pageContext={pageContext} />}
          >
            <BackgroundInput />
          </Suspense>
        </div>
        <IndexPendingBoundary>{children}</IndexPendingBoundary>
      </main>
    </IndexPendingProvider>
  );
}

function SortInputFallback({ pageContext }: { pageContext: PageContext }) {
  return (
    <div className={sortInputStyles.container} aria-hidden="true">
      <legend className={sortInputStyles.legend}>Sort</legend>
      <ul className={sortInputStyles.list}>
        {Object.values(SortOptions).map(option => (
          <li
            key={option}
            className={`${sortInputStyles.option}${pageContext.sort === option ? ` ${sortInputStyles.active}` : ''}`}
          >
            <p>{option}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BackgroundInputFallback({
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
    <fieldset className={radioStyles.container} aria-hidden="true">
      <legend className={radioStyles.legend}>background:</legend>
      <div className={radioStyles.options}>
        {options.map(option => (
          <span key={option.label} className={radioStyles.option}>
            <span
              className={styles.backgroundFallbackIndicator}
              data-active={pageContext.filter.background === option.value}
            />
            <span>{option.label}</span>
          </span>
        ))}
      </div>
    </fieldset>
  );
}

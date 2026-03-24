import { ReactNode, Suspense } from 'react';

import Backgrounds from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';
import PageContext from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import PageContextHelper from '@/helpers/pageContext';

import BackgroundInput from '@/components/backgroundInput';
import SearchNavigationProvider from '@/components/providers/searchNavigationProvider';
import SearchInput from '@/components/searchInput';
import searchInputStyles from '@/components/searchInput/index.module.css';
import SearchNavigationBoundary from '@/components/searchNavigationBoundary';
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
    <>
      <Header>
        <Suspense fallback={<SortInputFallback pageContext={pageContext} />}>
          <SortInput pageContext={pageContext} />
        </Suspense>
      </Header>
      <main className={styles.container}>
        <SearchNavigationProvider>
          <div className={styles.inputs}>
            <div className={styles.searchSlot}>
              <Suspense fallback={<SearchInputFallback />}>
                <SearchInput />
              </Suspense>
            </div>
            <Suspense
              fallback={<BackgroundInputFallback pageContext={pageContext} />}
            >
              <BackgroundInput />
            </Suspense>
          </div>
          <SearchNavigationBoundary>{children}</SearchNavigationBoundary>
        </SearchNavigationProvider>
      </main>
    </>
  );
}

function SearchInputFallback() {
  return (
    <form className={searchInputStyles.container} aria-hidden="true">
      <input
        type="search"
        placeholder="search"
        className={searchInputStyles.input}
        disabled
      />
      <span
        className={`${searchInputStyles.shortcut} ${searchInputStyles.outOfFocus} ${styles.searchFallbackShortcut}`}
      >
        /
      </span>
    </form>
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

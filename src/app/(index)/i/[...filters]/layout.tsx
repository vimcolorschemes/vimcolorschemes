import { ReactNode } from 'react';

import PageContextHelper from '@/helpers/pageContext';

import { SearchProvider } from '@/context/searchContext';

import BackgroundInput from '@/components/backgroundInput';
import SearchInput from '@/components/searchInput';
import SearchResults from '@/components/searchResults';
import SortInput from '@/components/sortInput';
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
    <SearchProvider>
      <Header>
        <SortInput pageContext={pageContext} />
      </Header>
      <main className={styles.container}>
        <div className={styles.inputs}>
          <SearchInput />
          <BackgroundInput />
        </div>
        <SearchResults>{children}</SearchResults>
      </main>
    </SearchProvider>
  );
}

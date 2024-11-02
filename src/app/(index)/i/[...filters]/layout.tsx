import { ReactNode } from 'react';

import PageContextHelper from '@/helpers/pageContext';

import BackgroundInput from '@/components/backgroundInput';
import EditorInput from '@/components/editorInput';
import SearchInput from '@/components/searchInput';
import SortInput from '@/components/sortInput';
import Header from '@/components/ui/header';

import styles from './layout.module.css';

type IndexPageLayoutProps = {
  children: ReactNode;
  params: {
    filters: string[];
  };
};

export default function IndexPageLayout({
  children,
  params,
}: IndexPageLayoutProps) {
  const pageContext = PageContextHelper.get(params.filters);
  return (
    <>
      <Header>
        <SortInput pageContext={pageContext} />
      </Header>
      <main className={styles.container}>
        <div className={styles.inputs}>
          <SearchInput />
          <BackgroundInput />
          <EditorInput />
        </div>
        {children}
      </main>
    </>
  );
}

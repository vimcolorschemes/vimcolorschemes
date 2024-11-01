import { ReactNode } from 'react';

import Header from '@/components/ui/header';

import styles from './page.module.css';

type RepositoryPageLayoutProps = {
  children: ReactNode;
};

export default function RepositoryPageLayout({
  children,
}: RepositoryPageLayoutProps) {
  return (
    <>
      <Header />
      <main className={styles.container}>{children}</main>
    </>
  );
}

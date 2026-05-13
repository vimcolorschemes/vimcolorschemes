import Link from 'next/link';
import { ReactNode } from 'react';

import Header from '@/components/ui/header';

import styles from './layout.module.css';

type AboutPageLayoutProps = {
  children: ReactNode;
};

export default function AboutPageLayout({ children }: AboutPageLayoutProps) {
  return (
    <>
      <Header showBranding={false}>
        <Link
          href="/i/trending"
          prefetch={false}
          className={styles.command}
          aria-label="Go home"
        >
          <span className={styles.prompt}>~</span>
          <span className={styles.operator}>❯</span>
          <span className={styles.binary}>man</span>
          <span className={styles.argument}>vimcolorschemes</span>
        </Link>
      </Header>
      {children}
    </>
  );
}

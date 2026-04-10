import Link from 'next/link';
import { ReactNode } from 'react';

import Branding from '@/components/ui/branding';

import styles from './index.module.css';

type HeaderProps = {
  children?: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <header className={styles.container}>
      <Link href="/i/trending" prefetch={false} className={styles.link}>
        <Branding />
      </Link>
      {children}
    </header>
  );
}

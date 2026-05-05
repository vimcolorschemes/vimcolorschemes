import Link from 'next/link';
import { ReactNode } from 'react';

import Branding from '@/components/ui/branding';

import styles from './index.module.css';

type HeaderProps = {
  children?: ReactNode;
  showBranding?: boolean;
};

export default function Header({ children, showBranding = true }: HeaderProps) {
  return (
    <header className={styles.container}>
      {showBranding && (
        <Link href="/i/trending" prefetch={false} className={styles.link}>
          <Branding />
        </Link>
      )}
      {children}
    </header>
  );
}

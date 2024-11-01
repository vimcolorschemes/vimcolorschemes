import cn from 'classnames';
import Link from 'next/link';
import { ReactNode } from 'react';

import Branding from '@/components/ui/branding';

import styles from './index.module.css';

type HeaderProps = {
  children?: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <header
      className={cn(styles.container, { [styles.isOnlyBranding]: !children })}
    >
      <Link href="/i/trending" className={styles.link}>
        <Branding />
      </Link>
      {children}
    </header>
  );
}

import cn from 'classnames';
import Link from 'next/link';

import PageContext from '@/lib/pageContext';

import SortInput from '@/components/sortInput';
import Branding from '@/components/ui/branding';

import styles from './index.module.css';

type HeaderProps = {
  pageContext?: PageContext;
};

export default function Header({ pageContext }: HeaderProps) {
  return (
    <header
      className={cn(styles.container, {
        [styles.isOnlyBranding]: !pageContext,
      })}
    >
      <Link href="/i/trending" className={styles.link}>
        <Branding />
      </Link>
      {pageContext && <SortInput pageContext={pageContext} />}
    </header>
  );
}

import cn from 'classnames';
import Link from 'next/link';

import IconArrow from '@/components/ui/icons/arrow';
import IconGithub from '@/components/ui/icons/github';
import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

export default function OwnerPageHeaderSkeleton() {
  return (
    <header className={styles.container}>
      <Link
        href="/i/trending"
        type="button"
        role="link"
        className={cn(styles.back, styles.link)}
      >
        <IconArrow />
        back
      </Link>
      <span className={styles.link}>
        <Skeleton className={styles.desktop} />
        <IconGithub />
      </span>
    </header>
  );
}

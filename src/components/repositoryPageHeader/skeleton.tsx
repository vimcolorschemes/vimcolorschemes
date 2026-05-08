import cn from 'classnames';
import Link from 'next/link';

import IconArrow from '@/components/ui/icons/arrow';
import IconGithub from '@/components/ui/icons/github';
import { TuiLoadingInline } from '@/components/ui/tuiLoading';

import styles from './index.module.css';

export default function RepositoryPageHeaderSkeleton() {
  return (
    <header className={styles.container}>
      <Link
        href="/i/trending"
        prefetch={false}
        type="button"
        role="link"
        className={cn(styles.back, styles.link)}
      >
        <IconArrow />
        back
      </Link>
      <span className={styles.link}>
        <TuiLoadingInline />
        <IconGithub />
      </span>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './index.module.css';

type RepositoryCommandProps = {
  owner?: string;
  name?: string;
};

export default function RepositoryCommand({
  owner,
  name,
}: RepositoryCommandProps) {
  const pathname = usePathname();
  const [pathOwner, pathName] = pathname.split('/').filter(Boolean);
  const repoOwner = owner ?? pathOwner;
  const repoName = name ?? pathName;

  if (!repoOwner || !repoName) {
    return (
      <Link href="/i/trending" prefetch={false} className={styles.homeCommand}>
        <span className={styles.prompt}>~</span>
        <span className={styles.operator}>❯</span>
        <span className={styles.command}>vimcolorschemes</span>
      </Link>
    );
  }

  return (
    <div className={styles.container} aria-label="Repository command">
      <Link href="/i/trending" prefetch={false} className={styles.homeCommand}>
        <span className={styles.prompt}>~</span>
        <span className={styles.operator}>❯</span>
        <span className={styles.command}>vimcolorschemes</span>
      </Link>
      <span className={styles.subcommand}>get</span>
      <span className={styles.argument}>
        {repoOwner}/{repoName}
      </span>
    </div>
  );
}

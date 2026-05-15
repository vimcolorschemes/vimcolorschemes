'use client';

import { usePathname } from 'next/navigation';

import HomeCommand from '@/components/homeCommand';

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
  const pathSegments = pathname.split('/').filter(Boolean);
  const [pathOwner, pathName] =
    pathSegments[0] === 'r' ? pathSegments.slice(1) : pathSegments;
  const repoOwner = owner ?? pathOwner;
  const repoName = name ?? pathName;
  const commandClassNames = {
    command: styles.command,
    operator: styles.operator,
    prompt: styles.prompt,
  };

  if (!repoOwner || !repoName) {
    return (
      <HomeCommand
        className={styles.homeCommand}
        classNames={commandClassNames}
      />
    );
  }

  return (
    <div className={styles.container} aria-label="Repository command">
      <HomeCommand
        className={styles.homeCommand}
        classNames={commandClassNames}
      />
      <span className={styles.subcommand}>get</span>
      <span className={styles.argument}>
        {repoOwner}/{repoName}
      </span>
    </div>
  );
}

'use client';

import cn from 'classnames';
import { useRouter } from 'next/navigation';

import IconArrow from '@/components/ui/icons/arrow';
import IconGithub from '@/components/ui/icons/github';

import styles from './index.module.css';

type RepositoryPageHeaderProps = {
  repositoryKey: string;
};

export default function RepositoryPageHeader({
  repositoryKey,
}: RepositoryPageHeaderProps) {
  const router = useRouter();

  function onBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    router.push('/trending');
  }

  return (
    <header className={styles.container}>
      <button
        type="button"
        onClick={onBack}
        role="link"
        className={cn(styles.back, styles.link)}
      >
        <IconArrow />
        back
      </button>
      <a
        href={`https://github.com/${repositoryKey}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        view <strong className={styles.desktop}>{repositoryKey} </strong>on
        Github
        <IconGithub />
      </a>
    </header>
  );
}

'use client';

import cn from 'classnames';
import { useRouter } from 'next/navigation';

import Owner from '@/models/owner';

import IconArrow from '@/components/ui/icons/arrow';
import IconGithub from '@/components/ui/icons/github';

import styles from './index.module.css';

type OwnerPageHeaderProps = {
  owner: Owner;
};

export default function OwnerPageHeader({ owner }: OwnerPageHeaderProps) {
  const router = useRouter();

  function onBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    router.push('/i/trending');
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
        href={`https://github.com/${owner.name}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        follow <strong className={styles.desktop}>{owner.name} </strong>on
        Github
        <IconGithub />
      </a>
    </header>
  );
}

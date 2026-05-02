'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import styles from './index.module.css';

type RepositoryPageModalProps = {
  children: ReactNode;
};

export default function RepositoryPageModal({
  children,
}: RepositoryPageModalProps) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        router.back();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [router]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close repository"
        onClick={() => router.back()}
      />
      <section className={styles.panel}>{children}</section>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import TuiSection from '@/components/tuiSection';

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
      <section className={styles.panel}>
        {children}
        <TuiSection
          as="footer"
          className={styles.shortcuts}
          aria-label="Modal shortcuts"
        >
          <span className={`${styles.shortcut} ${styles.variantShortcut}`}>
            <span className={styles.shortcutKey}>j</span>{' '}
            <span className={styles.shortcutKey}>/</span>{' '}
            <span className={styles.shortcutKey}>k</span>{' '}
            <span className={styles.shortcutAction}>variants</span>
          </span>
          <button
            type="button"
            className={styles.shortcut}
            aria-label="Close repository"
            onClick={() => router.back()}
          >
            <span className={styles.shortcutKey}>esc</span>{' '}
            <span className={styles.shortcutAction}>close</span>
          </button>
        </TuiSection>
      </section>
    </div>
  );
}

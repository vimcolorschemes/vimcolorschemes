'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useCallback, useRef } from 'react';

import TuiSection from '@/components/tuiSection';

import styles from './index.module.css';

type RepositoryPageModalProps = {
  children: ReactNode;
};

export default function RepositoryPageModal({
  children,
}: RepositoryPageModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeModal = useCallback(() => {
    const dialog = dialogRef.current;
    const opener = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href]'),
    ).find(link => new URL(link.href).pathname === pathname);

    if (dialog?.open) {
      dialog.close();
    }

    if (opener instanceof HTMLElement) {
      opener.focus({ preventScroll: true });
    }

    router.back();
  }, [pathname, router]);

  const setDialogRef = useCallback((dialog: HTMLDialogElement | null) => {
    dialogRef.current = dialog;

    if (!dialog || dialog.open) {
      return;
    }

    dialog.showModal();
  }, []);

  return (
    <dialog
      ref={setDialogRef}
      className={styles.overlay}
      aria-label="Repository details"
      onCancel={event => {
        event.preventDefault();
        closeModal();
      }}
    >
      <div
        className={styles.scroller}
        onClick={event => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}
      >
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
              onClick={closeModal}
            >
              <span className={styles.shortcutKey}>esc</span>{' '}
              <span className={styles.shortcutAction}>close</span>
            </button>
          </TuiSection>
        </section>
      </div>
    </dialog>
  );
}

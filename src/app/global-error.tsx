'use client';

import ErrorFallback from '@/components/errorFallback';

import './globals.css';
import './reset.css';
import './vim.css';

import styles from './global-error.module.css';

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <ErrorFallback
          error={error}
          reset={reset}
          title="500:"
          description="the app hit a problem."
        />
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import Header from '@/components/ui/header';

import styles from './index.module.css';

type ErrorWithDigest = Error & {
  digest?: string;
};

type ErrorFallbackProps = {
  error: ErrorWithDigest;
  reset?: () => void;
  title?: string;
  description?: string;
};

export default function ErrorFallback({
  error,
  reset,
  title = '500:',
  description = 'something went wrong.',
}: ErrorFallbackProps) {
  useEffect(() => {
    console.error('Application error boundary caught an error', {
      cause: error.cause,
      digest: error.digest,
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  }, [error]);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <p>
          <strong>{title} </strong>
          {description}
        </p>
        <div className={styles.actions}>
          {reset && (
            <button type="button" className={styles.button} onClick={reset}>
              try again
            </button>
          )}
          <Link href="/i/trending" prefetch={false} className={styles.link}>
            back to trending
          </Link>
        </div>
      </main>
    </>
  );
}

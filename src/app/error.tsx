'use client';

import ErrorFallback from '@/components/errorFallback';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return <ErrorFallback error={error} reset={reset} />;
}

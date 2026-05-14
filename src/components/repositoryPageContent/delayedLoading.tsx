'use client';

import { useEffect, useState } from 'react';

import TuiLoading from '@/components/ui/tuiLoading';

const REPOSITORY_LOADING_DELAY_MS = 250;

export default function RepositoryPageDelayedLoading() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsVisible(true);
    }, REPOSITORY_LOADING_DELAY_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return <TuiLoading />;
}

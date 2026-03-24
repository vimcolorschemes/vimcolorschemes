'use client';

import { ReactNode } from 'react';

import { useSearchNavigation } from '@/components/providers/searchNavigationProvider';
import RepositoriesSkeleton from '@/components/repositories/skeleton';

export default function SearchNavigationBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const { isNavigatingSearch } = useSearchNavigation();

  if (isNavigatingSearch) {
    return <RepositoriesSkeleton />;
  }

  return <>{children}</>;
}

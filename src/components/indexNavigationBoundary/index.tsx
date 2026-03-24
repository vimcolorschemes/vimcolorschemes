'use client';

import { ReactNode } from 'react';

import { useIndexNavigation } from '@/components/providers/indexNavigationProvider';
import RepositoriesSkeleton from '@/components/repositories/skeleton';

export default function IndexNavigationBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const { isNavigatingIndex } = useIndexNavigation();

  if (isNavigatingIndex) {
    return <RepositoriesSkeleton />;
  }

  return <>{children}</>;
}

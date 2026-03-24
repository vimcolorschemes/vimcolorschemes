'use client';

import { ReactNode } from 'react';

import { useIndexPending } from '@/components/providers/indexPendingProvider';
import RepositoriesSkeleton from '@/components/repositories/skeleton';

export default function IndexPendingBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const { isPending } = useIndexPending();

  if (isPending) {
    return <RepositoriesSkeleton />;
  }

  return <>{children}</>;
}

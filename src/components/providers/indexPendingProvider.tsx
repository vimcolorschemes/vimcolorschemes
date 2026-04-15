'use client';

import { usePathname } from 'next/navigation';
import { createContext, use, useState } from 'react';

import type { PageContext } from '@/lib/pageContext';

import { PageContextHelper } from '@/helpers/pageContext';

type IndexPendingContextValue = {
  isPending: boolean;
  pageContext: PageContext;
  startPending: (pathname: string, pageContext: PageContext) => void;
};

type PendingIndexState = {
  pathname: string;
  pageContext: PageContext;
};

const IndexPendingContext = createContext<IndexPendingContextValue | null>(
  null,
);

function getFiltersFromPathname(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean);
  const indexRouteStart = segments.indexOf('i');
  return indexRouteStart === -1
    ? segments
    : segments.slice(indexRouteStart + 1);
}

export default function IndexPendingProvider({
  children,
}: Required<React.PropsWithChildren>) {
  const pathname = usePathname();
  const filters = getFiltersFromPathname(pathname);
  const currentPageContext = PageContextHelper.get(filters);
  const [pendingState, setPendingState] = useState<PendingIndexState | null>(
    null,
  );

  const isPending = pendingState !== null && pendingState.pathname !== pathname;
  const pageContext = isPending ? pendingState.pageContext : currentPageContext;

  return (
    <IndexPendingContext.Provider
      value={{
        isPending,
        pageContext,
        startPending: (nextPathname, nextPageContext) =>
          setPendingState({
            pathname: nextPathname,
            pageContext: nextPageContext,
          }),
      }}
    >
      {children}
    </IndexPendingContext.Provider>
  );
}

export function useIndexPending() {
  const context = use(IndexPendingContext);

  if (!context) {
    throw new Error(
      'useIndexPending must be used within an IndexPendingProvider',
    );
  }

  return context;
}

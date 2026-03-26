'use client';

import { usePathname } from 'next/navigation';
import { createContext, use, useState } from 'react';

import type { PageContext } from '@/lib/pageContext';

import { getIndexRouteState } from '@/helpers/indexRoute';
import { PageContextHelper } from '@/helpers/pageContext';

type IndexPendingContextValue = {
  isPending: boolean;
  pageContext: PageContext;
  searchQuery: string;
  startPending: (
    pathname: string,
    pageContext: PageContext,
    searchQuery: string,
  ) => void;
};

type PendingIndexState = {
  pathname: string;
  pageContext: PageContext;
  searchQuery: string;
};

const IndexPendingContext = createContext<IndexPendingContextValue | null>(
  null,
);

export default function IndexPendingProvider({
  children,
}: Required<React.PropsWithChildren>) {
  const pathname = usePathname();
  const routeState = getIndexRouteState(pathname);
  const currentPageContext = PageContextHelper.get(routeState.filters);
  const [pendingState, setPendingState] = useState<PendingIndexState | null>(
    null,
  );

  const isPending = pendingState !== null && pendingState.pathname !== pathname;
  const pageContext = isPending ? pendingState.pageContext : currentPageContext;
  const searchQuery = isPending ? pendingState.searchQuery : routeState.search;

  return (
    <IndexPendingContext.Provider
      value={{
        isPending,
        pageContext,
        searchQuery,
        startPending: (nextPathname, nextPageContext, nextSearchQuery) =>
          setPendingState({
            pathname: nextPathname,
            pageContext: nextPageContext,
            searchQuery: nextSearchQuery,
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

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, ReactNode, use, useTransition } from 'react';

import PageContext from '@/lib/pageContext';

import { buildIndexRoutePath } from '@/helpers/indexRoute';

type IndexNavigationContextValue = {
  isNavigatingIndex: boolean;
  navigateToIndex: (pageContext: PageContext, query: string) => void;
};

const IndexNavigationContext =
  createContext<IndexNavigationContextValue | null>(null);

export default function IndexNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigatingSearch, startTransition] = useTransition();

  return (
    <IndexNavigationContext.Provider
      value={{
        isNavigatingIndex: isNavigatingSearch,
        navigateToIndex: (pageContext, query) => {
          const nextPathname = buildIndexRoutePath(pageContext, query);

          if (nextPathname === pathname) {
            return;
          }

          startTransition(() => {
            router.replace(nextPathname, { scroll: false });
          });
        },
      }}
    >
      {children}
    </IndexNavigationContext.Provider>
  );
}

export function useIndexNavigation() {
  const context = use(IndexNavigationContext);

  if (!context) {
    throw new Error(
      'useIndexNavigation must be used within an IndexNavigationProvider',
    );
  }

  return context;
}

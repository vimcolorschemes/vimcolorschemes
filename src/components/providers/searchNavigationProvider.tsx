'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, ReactNode, use, useTransition } from 'react';

import PageContext from '@/lib/pageContext';

import { buildIndexRoutePath } from '@/helpers/indexRoute';

type SearchNavigationContextValue = {
  isNavigatingSearch: boolean;
  navigateToSearch: (pageContext: PageContext, query: string) => void;
};

const SearchNavigationContext =
  createContext<SearchNavigationContextValue | null>(null);

export default function SearchNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigatingSearch, startTransition] = useTransition();

  return (
    <SearchNavigationContext.Provider
      value={{
        isNavigatingSearch,
        navigateToSearch: (pageContext, query) => {
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
    </SearchNavigationContext.Provider>
  );
}

export function useSearchNavigation() {
  const context = use(SearchNavigationContext);

  if (!context) {
    throw new Error(
      'useSearchNavigation must be used within a SearchNavigationProvider',
    );
  }

  return context;
}

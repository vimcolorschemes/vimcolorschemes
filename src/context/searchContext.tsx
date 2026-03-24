'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import RepositoriesClientService from '@/services/repositoriesClient';

import Repository from '@/models/repository';

import { BackgroundFilter } from '@/lib/filter';
import Sort from '@/lib/sort';

import PageContextHelper from '@/helpers/pageContext';

type SearchState = {
  query: string;
  results: Repository[] | null;
  count: number;
  page: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  sort: Sort | null;
  background: BackgroundFilter | undefined;
};

type SearchAction =
  | {
      type: 'search_started';
      query: string;
      sort: Sort;
      background?: BackgroundFilter;
    }
  | {
      type: 'search_succeeded';
      results: Repository[];
      count: number;
    }
  | {
      type: 'search_failed';
    }
  | {
      type: 'load_more_started';
    }
  | {
      type: 'load_more_succeeded';
      results: Repository[];
      page: number;
    }
  | {
      type: 'load_more_failed';
    }
  | {
      type: 'search_cleared';
    };

type SearchContextValue = SearchState & {
  search: (query: string) => void;
  loadMoreSearchResults: () => void;
  clearSearch: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

const initialState: SearchState = {
  query: '',
  results: null,
  count: 0,
  page: 1,
  isLoading: false,
  isLoadingMore: false,
  sort: null,
  background: undefined,
};

function createInitialState({
  query,
  sort,
  background,
}: {
  query: string;
  sort: Sort;
  background?: BackgroundFilter;
}): SearchState {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return initialState;
  }

  return {
    ...initialState,
    query: trimmedQuery,
    isLoading: true,
    sort,
    background,
  };
}

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'search_started':
      return {
        ...state,
        query: action.query,
        sort: action.sort,
        background: action.background,
        page: 1,
        isLoading: true,
        isLoadingMore: false,
      };
    case 'search_succeeded':
      return {
        ...state,
        results: action.results,
        count: action.count,
        page: 1,
        isLoading: false,
        isLoadingMore: false,
      };
    case 'search_failed':
      return {
        ...state,
        isLoading: false,
        isLoadingMore: false,
      };
    case 'load_more_started':
      return {
        ...state,
        isLoadingMore: true,
      };
    case 'load_more_succeeded':
      return {
        ...state,
        results: [...(state.results || []), ...action.results],
        page: action.page,
        isLoadingMore: false,
      };
    case 'load_more_failed':
      return {
        ...state,
        isLoadingMore: false,
      };
    case 'search_cleared':
      return initialState;
    default:
      return state;
  }
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(2));
  const queryParam = searchParams.get('search') ?? '';
  const searchAbortControllerRef = useRef<AbortController | null>(null);
  const searchRequestIdRef = useRef(0);
  const [state, dispatch] = useReducer(
    searchReducer,
    {
      query: queryParam,
      sort: pageContext.sort,
      background: pageContext.filter.background,
    },
    createInitialState,
  );

  const runSearch = useCallback(
    async (query: string, sort: Sort, background?: BackgroundFilter) => {
      searchRequestIdRef.current += 1;
      const requestId = searchRequestIdRef.current;

      searchAbortControllerRef.current?.abort();

      if (!query.trim()) {
        dispatch({ type: 'search_cleared' });
        return;
      }

      const abortController = new AbortController();
      searchAbortControllerRef.current = abortController;

      dispatch({
        type: 'search_started',
        query,
        sort,
        background,
      });

      try {
        const data = await RepositoriesClientService.fetchRepositories({
          sort,
          filter: {
            search: query,
            background,
          },
          signal: abortController.signal,
        });

        if (requestId !== searchRequestIdRef.current) {
          return;
        }

        dispatch({
          type: 'search_succeeded',
          results: data.repositories,
          count: data.count,
        });
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        if (requestId !== searchRequestIdRef.current) {
          return;
        }

        dispatch({ type: 'search_failed' });
        throw error;
      } finally {
        if (searchAbortControllerRef.current === abortController) {
          searchAbortControllerRef.current = null;
        }
      }
    },
    [],
  );

  useEffect(() => {
    const query = queryParam.trim();

    if (!query) {
      searchRequestIdRef.current += 1;
      searchAbortControllerRef.current?.abort();
      searchAbortControllerRef.current = null;
      dispatch({ type: 'search_cleared' });
      return;
    }

    void runSearch(query, pageContext.sort, pageContext.filter.background);
  }, [pageContext.filter.background, pageContext.sort, queryParam, runSearch]);

  const search = useCallback(
    (query: string) => {
      const value = query.trim();
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }

      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const loadMoreSearchResults = useCallback(async () => {
    if (
      state.isLoading ||
      state.isLoadingMore ||
      !state.results ||
      !state.sort
    ) {
      return;
    }

    const nextPage = state.page + 1;
    dispatch({ type: 'load_more_started' });

    try {
      const data = await RepositoriesClientService.fetchRepositories({
        sort: state.sort,
        filter: {
          search: state.query,
          background: state.background,
        },
        page: nextPage,
      });

      dispatch({
        type: 'load_more_succeeded',
        results: data.repositories,
        page: nextPage,
      });
    } catch (error) {
      dispatch({ type: 'load_more_failed' });
      throw error;
    }
  }, [
    state.isLoading,
    state.isLoadingMore,
    state.results,
    state.sort,
    state.page,
    state.query,
    state.background,
  ]);

  const clearSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');

    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  return (
    <SearchContext.Provider
      value={{ ...state, search, loadMoreSearchResults, clearSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

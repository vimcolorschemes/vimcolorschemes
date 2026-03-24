'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

import RepositoryDTO from '@/models/DTO/repository';
import Repository from '@/models/repository';

import { BackgroundFilter } from '@/lib/filter';
import Sort from '@/lib/sort';

type SearchState = {
  query: string;
  results: Repository[] | null;
  count: number;
  page: number;
  isSearching: boolean;
  sort: Sort | null;
  background: BackgroundFilter | undefined;
};

type SearchContextValue = SearchState & {
  search: (query: string, sort: Sort, background?: BackgroundFilter) => void;
  loadMoreSearchResults: () => void;
  clearSearch: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

function parseRepositoryDTO(dto: RepositoryDTO): Repository {
  return new Repository({
    ...dto,
    githubCreatedAt: new Date(dto.githubCreatedAt),
    pushedAt: new Date(dto.pushedAt),
  });
}

async function fetchRepositories(params: URLSearchParams) {
  const response = await fetch(`/api/repositories?${params}`);
  return response.json();
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: null,
    count: 0,
    page: 1,
    isSearching: false,
    sort: null,
    background: undefined,
  });

  const search = useCallback(
    async (query: string, sort: Sort, background?: BackgroundFilter) => {
      if (!query.trim()) {
        setState(prev => ({
          ...prev,
          query: '',
          results: null,
          count: 0,
          page: 1,
          isSearching: false,
          sort: null,
          background: undefined,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        query,
        isSearching: true,
        sort,
        background,
      }));

      const params = new URLSearchParams({
        sort,
        search: query,
        page: '1',
      });
      if (background) params.set('background', background);

      const data = await fetchRepositories(params);
      const repos = (data.repositories as RepositoryDTO[]).map(
        parseRepositoryDTO,
      );

      setState(prev => ({
        ...prev,
        results: repos,
        count: data.count,
        page: 1,
        isSearching: false,
      }));
    },
    [],
  );

  const loadMoreSearchResults = useCallback(async () => {
    if (state.isSearching || !state.results || !state.sort) return;

    const nextPage = state.page + 1;
    setState(prev => ({ ...prev, isSearching: true }));

    const params = new URLSearchParams({
      sort: state.sort,
      search: state.query,
      page: String(nextPage),
    });
    if (state.background) params.set('background', state.background);

    const data = await fetchRepositories(params);
    const repos = (data.repositories as RepositoryDTO[]).map(
      parseRepositoryDTO,
    );

    setState(prev => ({
      ...prev,
      results: [...(prev.results || []), ...repos],
      page: nextPage,
      isSearching: false,
    }));
  }, [
    state.isSearching,
    state.results,
    state.sort,
    state.page,
    state.query,
    state.background,
  ]);

  const clearSearch = useCallback(() => {
    setState({
      query: '',
      results: null,
      count: 0,
      page: 1,
      isSearching: false,
      sort: null,
      background: undefined,
    });
  }, []);

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

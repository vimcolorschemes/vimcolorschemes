import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import SearchService from '@/services/search';
import useDebounce from './debounce';
import { APIRepository } from '@/models/api';
import { RepositoriesPageContext, Repository } from '@/models/repository';

interface Props {
  defaultRepositoriesData: {
    apiRepositories: APIRepository[];
    totalCount: number;
  };
  defaultPageData: RepositoriesPageContext;
}

interface Search {
  input: string;
  setInput: (value: string) => void;
  repositories: Repository[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  isSearching: boolean;
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
}

/**
 * Manages what repositories to display based on various inputs
 *
 * @param {Object} defaultRepositoriesData - The repositories data coming from
 * the base GraphQL query
 * @param {Object} defaultPageData - The page context data coming from the base
 * GraphQL query
 * @returns {Object} Current search and repositories state
 */
function useSearch({
  defaultRepositoriesData,
  defaultPageData,
}: Props): Search {
  const defaultRepositories = useMemo(
    () =>
      defaultRepositoriesData.apiRepositories.map(
        apiRepository => new Repository(apiRepository),
      ),
    [defaultRepositoriesData.apiRepositories],
  );

  const [page, setPage] = useState<number>(defaultPageData.currentPage || 1);
  const [input, setInput] = useState<string>('');
  const debouncedInput = useDebounce(input);

  const { data: searchData, error } = useSWR(
    [debouncedInput, page],
    SearchService.search,
  );

  const isLoading = useMemo(() => !searchData && !error, [searchData, error]);

  const isSearching = useMemo(() => !!debouncedInput.length, [debouncedInput]);

  useEffect(() => setPage(1), [debouncedInput]);
  useEffect(() => setPage(defaultPageData.currentPage), [
    defaultPageData.currentPage,
  ]);
  useEffect(() => {
    if (isSearching) {
      return;
    }

    setPage(defaultPageData.currentPage);
  }, [isSearching, page, defaultPageData.currentPage]);

  const repositories = useMemo(
    () => (isSearching ? searchData?.repositories || [] : defaultRepositories),
    [debouncedInput, searchData?.repositories, defaultRepositories],
  );

  const totalCount = useMemo(
    () =>
      isSearching
        ? searchData?.totalCount || 0
        : defaultRepositoriesData.totalCount,
    [
      debouncedInput,
      searchData?.totalCount,
      defaultRepositoriesData.totalCount,
    ],
  );

  const pageCount = useMemo(
    () =>
      (isSearching ? searchData?.pageCount : defaultPageData.pageCount) || 1,
    [debouncedInput, searchData?.pageCount, defaultPageData.pageCount],
  );

  return {
    input,
    setInput,
    repositories,
    totalCount,
    isLoading,
    isError: !!error,
    isSearching,
    page,
    setPage,
    pageCount,
  };
}

export default useSearch;

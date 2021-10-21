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
  const [repositories, setRepositories] =
    useState<Repository[]>(defaultRepositories);
  const [totalCount, setTotalCount] = useState<number>(
    defaultRepositoriesData.totalCount,
  );
  const [input, setInput] = useState<string>('');
  const debouncedInput = useDebounce(input);

  const { data: searchData, error } = useSWR(
    [debouncedInput, page],
    SearchService.search,
  );

  const isSearching = useMemo(() => !!debouncedInput.length, [debouncedInput]);

  const isLoading = useMemo(
    () => isSearching && !searchData && !error,
    [searchData, error],
  );

  useEffect(() => setPage(1), [debouncedInput]);

  useEffect(
    () => setPage(defaultPageData.currentPage),
    [defaultPageData.currentPage],
  );

  useEffect(() => {
    if (!isSearching) {
      setPage(defaultPageData.currentPage);
    }
  }, [isSearching, page, defaultPageData.currentPage]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isSearching) {
      setRepositories(defaultRepositories);
      return;
    }

    setRepositories(searchData?.repositories || []);
  }, [isSearching, isLoading, searchData?.repositories, defaultRepositories]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isSearching) {
      setTotalCount(defaultRepositoriesData.totalCount);
      return;
    }

    setTotalCount(searchData?.totalCount || 0);
  }, [
    isSearching,
    isLoading,
    searchData?.totalCount,
    defaultRepositoriesData.totalCount,
  ]);

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

import { useMemo, useState } from 'react';
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
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
}

/**
 * Manages what repositories to display based on various inputs
 *
 * @param {Object} repositoriesData - The repositories data coming from the
 * base GraphQL query
 * @returns {Object} Objects and functions to help manage what to display
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

  const repositories = useMemo(
    () =>
      !!debouncedInput.length
        ? searchData?.repositories || []
        : defaultRepositories,
    [debouncedInput, searchData?.repositories, defaultRepositories],
  );

  const totalCount = useMemo(
    () =>
      !!debouncedInput.length
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
      !!debouncedInput.length
        ? searchData?.pageCount || 0
        : defaultPageData.pageCount,
    [debouncedInput, searchData?.pageCount, defaultPageData.pageCount],
  );

  return {
    input,
    setInput,
    repositories,
    totalCount,
    isLoading,
    isError: !!error,
    page,
    setPage,
    pageCount,
  };
}

export default useSearch;

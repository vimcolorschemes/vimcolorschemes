import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import LocalStorageHelper from '@/helpers/localStorage';
import LocalStorageKeys from '@/lib/localStorage';
import SearchService from '@/services/search';
import useDebounce from '@/hooks/debounce';
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

  const storedSearchInput = LocalStorageHelper.get(
    LocalStorageKeys.SearchInput,
  );
  const storedSearchPage = LocalStorageHelper.get(LocalStorageKeys.SearchPage);

  const [page, setPage] = useState<number>(
    Number(storedSearchPage) || defaultPageData.currentPage || 1,
  );
  const [input, setInput] = useState<string>(storedSearchInput);
  const debouncedInput = useDebounce(input);

  const { data: searchData, error } = useSWR(
    [debouncedInput, page],
    SearchService.search,
  );

  const isSearching = useMemo(() => !!debouncedInput.length, [debouncedInput]);

  const isLoading = useMemo(
    () => isSearching && !searchData && !error,
    [isSearching, searchData, error],
  );

  function storeSearchData() {
    LocalStorageHelper.set(LocalStorageKeys.SearchInput, debouncedInput);
    LocalStorageHelper.set(LocalStorageKeys.SearchPage, page.toString());
  }

  function resetSearchData() {
    LocalStorageHelper.remove(LocalStorageKeys.SearchInput);
    LocalStorageHelper.remove(LocalStorageKeys.SearchPage);
  }

  useEffect(() => {
    if (isSearching) {
      storeSearchData();
    } else {
      resetSearchData();
    }
  }, [isSearching, debouncedInput, page]);

  useEffect(
    () => setPage(defaultPageData.currentPage),
    [defaultPageData.currentPage],
  );

  useEffect(() => {
    if (isSearching) {
      setPage(1);
    } else {
      setPage(defaultPageData.currentPage);
    }
  }, [isSearching, defaultPageData.currentPage]);

  const repositories = useMemo(() => {
    if (isSearching) {
      return searchData?.repositories || [];
    }

    return defaultRepositories;
  }, [isSearching, searchData?.repositories, defaultRepositories]);

  const totalCount = useMemo(() => {
    if (isSearching) {
      return searchData?.totalCount || 0;
    }

    return defaultRepositoriesData.totalCount;
  }, [isSearching, searchData?.totalCount, defaultRepositoriesData.totalCount]);

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

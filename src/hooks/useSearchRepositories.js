import { useState, useEffect } from "react";

import useSWR from "swr";

import { REPOSITORY_COUNT_PER_PAGE } from "src/constants";

import { searchRepositories } from "src/api/repository";

import { useDebounce } from "src/hooks/useDebounce";

export const SEARCH_INPUT_LOCAL_STORAGE_KEY = "search-input";
export const SEARCH_PAGE_LOCAL_STORAGE_KEY = "search-page";

const getLocalStorageItem = (key, defaulValue = "") =>
  typeof window !== "undefined" && window.previousPath
    ? localStorage.getItem(key) || defaulValue
    : defaulValue;

/**
 * Hook that handles the logic for searching repositories
 *
 * @param {object[]} defaultRepositories
 * @param {number} defaultTotalCount
 * @param {number} defaultPage
 * @param {number} defaultPageCount
 *
 * @returns {object} The search state, repositories to display and the loading state
 */
export const useSearchRepositories = (
  defaultRepositories,
  defaultTotalCount,
  defaultPage,
  defaultPageCount,
) => {
  const [searchInput, setSearchInput] = useState(
    getLocalStorageItem(SEARCH_INPUT_LOCAL_STORAGE_KEY),
  );
  const debouncedSearchInput = useDebounce(searchInput);

  const [page, setPage] = useState(
    Number(getLocalStorageItem(SEARCH_PAGE_LOCAL_STORAGE_KEY, 1)),
  );

  useEffect(() => clearSearchData(), []);

  useEffect(() => {
    if (!debouncedSearchInput) setPage(1);
  }, [debouncedSearchInput]);

  const { data, error } = useSWR(
    debouncedSearchInput ? [debouncedSearchInput, page] : undefined,
    searchRepositories,
  );

  const storeSearchData = () => {
    localStorage.setItem(SEARCH_INPUT_LOCAL_STORAGE_KEY, debouncedSearchInput);
    localStorage.setItem(SEARCH_PAGE_LOCAL_STORAGE_KEY, page);
  };

  const clearSearchData = () => {
    localStorage.removeItem(SEARCH_INPUT_LOCAL_STORAGE_KEY);
    localStorage.removeItem(SEARCH_PAGE_LOCAL_STORAGE_KEY);
  };

  const usedTotalCount = debouncedSearchInput
    ? data?.totalCount
    : defaultTotalCount;

  const usedPage = debouncedSearchInput ? page : defaultPage;
  const usedPageCount = debouncedSearchInput
    ? data?.pageCount || 1
    : defaultPageCount;
  const startIndex = usedTotalCount
    ? (usedPage - 1) * REPOSITORY_COUNT_PER_PAGE + 1
    : 0;
  const endIndex = usedTotalCount
    ? usedPage === usedPageCount
      ? usedTotalCount
      : usedPage * REPOSITORY_COUNT_PER_PAGE
    : 0;

  return {
    searchInput,
    debouncedSearchInput,
    setSearchInput,
    storeSearchData,
    page: usedPage,
    setPage,
    pageCount: usedPageCount,
    startIndex,
    endIndex,
    repositories: !!debouncedSearchInput
      ? data?.repositories || []
      : defaultRepositories,
    totalCount: usedTotalCount,
    isLoading: !!debouncedSearchInput && !data && !error,
    isError: !!error,
  };
};

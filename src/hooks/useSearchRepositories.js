import { useState, useEffect } from "react";

import useSWR from "swr";

import { searchRepositories } from "src/api/repository";

import { useDebounce } from "src/hooks/useDebounce";

export const SEARCH_INPUT_LOCAL_STORAGE_KEY = "search-input";
export const SEARCH_PAGE_LOCAL_STORAGE_KEY = "search-page";

/**
 * Hook that manages the search input, the repositories and loading state depending on a search query
 *
 * @param {object[]} defaultRepositories The repositories to return if nothing
 * is searched
 * @param {number} defaultTotalCount The total count to return if nothing
 *
 * @returns {object} The search state, repositories to display and the loading state
 */
export const useSearchRepositories = (
  defaultRepositories,
  defaultTotalCount,
) => {
  const initialSearchInput =
    typeof window !== "undefined" && window.previousPath
      ? localStorage.getItem(SEARCH_INPUT_LOCAL_STORAGE_KEY) || ""
      : "";

  const [searchInput, setSearchInput] = useState(initialSearchInput);

  const initialSearchPage =
    typeof window !== "undefined" && window.previousPath
      ? Number(localStorage.getItem(SEARCH_PAGE_LOCAL_STORAGE_KEY)) || 1
      : 1;

  const [page, setPage] = useState(initialSearchPage);

  useEffect(() => clearSearchInput(), []);

  const debouncedSearchInput = useDebounce(searchInput);

  const { data, error } = useSWR(
    debouncedSearchInput ? [debouncedSearchInput, page] : undefined,
    searchRepositories,
  );

  const storeSearchData = () => {
    localStorage.setItem(SEARCH_INPUT_LOCAL_STORAGE_KEY, debouncedSearchInput);
    localStorage.setItem(SEARCH_PAGE_LOCAL_STORAGE_KEY, page);
  };

  const clearSearchInput = () =>
    localStorage.removeItem(SEARCH_INPUT_LOCAL_STORAGE_KEY);

  return {
    searchInput,
    debouncedSearchInput,
    setSearchInput,
    storeSearchData,
    page,
    setPage,
    repositories: !!debouncedSearchInput
      ? data?.repositories || []
      : defaultRepositories,
    totalCount: !!debouncedSearchInput
      ? data?.totalCount || 0
      : defaultTotalCount,
    isLoading: !!debouncedSearchInput && !data && !error,
  };
};

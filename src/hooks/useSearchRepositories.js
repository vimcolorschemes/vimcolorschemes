import { useState, useEffect } from "react";

import useSWR from "swr";

import { searchRepositories } from "src/api/repository";

import { useDebounce } from "src/hooks/useDebounce";

export const SEARCH_INPUT_LOCAL_STORAGE_KEY = "search-input";

/**
 * Hook that manages the search input, the repositories and loading state depending on a search query
 *
 * @param {object[]} defaultRepositories The repositories to return if nothing
 * is searched
 *
 * @returns {object} The search state, repositories to display and the loading state
 */
export const useSearchRepositories = defaultRepositories => {
  const [searchInput, setSearchInput] = useState(
    window.previousPath
      ? localStorage.getItem(SEARCH_INPUT_LOCAL_STORAGE_KEY) || ""
      : "",
  );

  useEffect(() => clearSearchInput(), []);

  const debouncedSearchInput = useDebounce(searchInput);

  const { data, error } = useSWR(debouncedSearchInput, searchRepositories);

  const storeSearchInput = () =>
    localStorage.setItem(SEARCH_INPUT_LOCAL_STORAGE_KEY, debouncedSearchInput);

  const clearSearchInput = () =>
    localStorage.removeItem(SEARCH_INPUT_LOCAL_STORAGE_KEY);

  return {
    searchInput,
    debouncedSearchInput,
    setSearchInput,
    storeSearchInput,
    repositories: !!debouncedSearchInput ? data || [] : defaultRepositories,
    isLoading: !!debouncedSearchInput && !data && !error,
  };
};

import useSWR from "swr";

import { searchRepositories } from "src/api/repository";

/**
 * Hook that manages repositories and loading state depending on a search query
 *
 * @param {string} query The search input to match
 * @param {object[]} defaultRepositories The repositories to return if nothing
 * is searched
 *
 * @returns {object} The repositories to display and the loading state
 */
export const useSearch = (query, defaultRepositories) => {
  const { data, error } = useSWR(query, searchRepositories);

  const isLoading = !!query && !data && !error;
  return {
    repositories: !!query ? data || [] : defaultRepositories,
    isLoading,
  };
};

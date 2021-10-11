import { useMemo, useState } from 'react';
import useSWR from 'swr';

import SearchService from '@/services/search';
import useDebounce from './debounce';
import { APIRepository } from '@/models/api';
import { Repository } from '@/models/repository';

interface Search {
  input: string;
  setInput: (value: string) => void;
  repositories: Repository[];
  totalCount: number;
  isLoading: boolean;
}

interface Props {
  apiRepositories: APIRepository[];
  totalCount: number;
}

/**
 * Manages what repositories to display based on various inputs
 *
 * @param {Object} repositoriesData - The repositories data coming from the
 * base GraphQL query
 * @returns {Object} Objects and functions to help manage what to display 
 */
function useSearch(repositoriesData: Props): Search {
  const defaultRepositories = useMemo(
    () =>
      repositoriesData.apiRepositories.map(
        apiRepository => new Repository(apiRepository),
      ),
    [repositoriesData.apiRepositories],
  );

  const [input, setInput] = useState<string>('');
  const debouncedInput = useDebounce(input);

  const { data, error } = useSWR([debouncedInput, 1], SearchService.search);

  const isLoading = useMemo(() => !data && !error, [data, error]);

  const repositories = useMemo(
    () =>
      !!debouncedInput.length ? data?.repositories || [] : defaultRepositories,
    [debouncedInput, data?.repositories, defaultRepositories],
  );

  const totalCount = useMemo(
    () =>
      !!debouncedInput.length
        ? data?.totalCount || 0
        : repositoriesData.totalCount,
    [debouncedInput, data?.totalCount, repositoriesData.totalCount],
  );

  return {
    input,
    setInput,
    repositories,
    totalCount,
    isLoading,
  };
}

export default useSearch;

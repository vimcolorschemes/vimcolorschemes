import { RepositoryDTO } from '@/models/DTO/repository';

import type { Filter } from '@/lib/filter';
import type { Sort } from '@/lib/sort';

type FetchRepositoriesParams = {
  sort: Sort;
  filter?: Filter;
  page?: number;
  signal?: AbortSignal;
};

type FetchRepositoriesResult = {
  repositories: RepositoryDTO[];
  hasMore: boolean;
  count?: number;
};

function buildSearchParams({
  sort,
  filter,
  page = 1,
}: Omit<FetchRepositoriesParams, 'signal'>): URLSearchParams {
  const params = new URLSearchParams({
    sort,
    page: String(page),
  });

  if (filter?.background) {
    params.set('background', filter.background);
  }

  if (filter?.owner) {
    params.set('owner', filter.owner);
  }

  return params;
}

async function fetchRepositories({
  sort,
  filter,
  page = 1,
  signal,
}: FetchRepositoriesParams): Promise<FetchRepositoriesResult> {
  const params = buildSearchParams({ sort, filter, page });
  const response = await fetch(`/api/repositories?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.status}`);
  }

  const data = (await response.json()) as {
    repositories: RepositoryDTO[];
    hasMore: boolean;
    count?: number;
  };

  return data;
}

export const RepositoriesClientService = {
  fetchRepositories,
};

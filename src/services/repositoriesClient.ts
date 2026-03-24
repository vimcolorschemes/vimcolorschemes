import RepositoryDTO from '@/models/DTO/repository';
import Repository from '@/models/repository';

import type Filter from '@/lib/filter';
import type Sort from '@/lib/sort';

type FetchRepositoriesParams = {
  sort: Sort;
  filter?: Filter;
  page?: number;
  signal?: AbortSignal;
};

type FetchRepositoriesResult = {
  repositories: Repository[];
  count: number;
};

function parseRepositoryDTO(dto: RepositoryDTO): Repository {
  return new Repository({
    ...dto,
    githubCreatedAt: new Date(dto.githubCreatedAt),
    pushedAt: new Date(dto.pushedAt),
  });
}

function buildSearchParams({
  sort,
  filter,
  page = 1,
}: Omit<FetchRepositoriesParams, 'signal'>): URLSearchParams {
  const params = new URLSearchParams({
    sort,
    page: String(page),
  });

  if (filter?.search) {
    params.set('search', filter.search);
  }

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
  const data = (await response.json()) as {
    repositories: RepositoryDTO[];
    count: number;
  };

  return {
    repositories: data.repositories.map(parseRepositoryDTO),
    count: data.count,
  };
}

const RepositoriesClientService = {
  fetchRepositories,
};

export default RepositoriesClientService;

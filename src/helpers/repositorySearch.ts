import { RepositoryDTO } from '@/models/DTO/repository';

import type { Background } from '@/lib/backgrounds';
import type { BackgroundFilter } from '@/lib/filter';
import type { Sort } from '@/lib/sort';
import { SortOptions } from '@/lib/sort';

type RepositorySearchFilter = {
  background?: BackgroundFilter;
};

type SearchRepositoriesParams = {
  repositories: RepositoryDTO[];
  query: string;
  sort: Sort;
  filter: RepositorySearchFilter;
  page: number;
  pageSize: number;
};

type SearchRepositoriesResult = {
  repositories: RepositoryDTO[];
  count: number;
  hasMore: boolean;
};

type ScoredRepository = {
  repository: RepositoryDTO;
  score: number;
};

type RepositorySearchFields = {
  owner: string;
  name: string;
  key: string;
  description: string;
  colorschemeNames: string[];
};

function normalize(value: string): string {
  return value.toLowerCase();
}

function getSearchTokens(query: string): string[] {
  return normalize(query)
    .split(/[^\w]+/)
    .filter(Boolean);
}

function getRepositoryBackgrounds(repository: RepositoryDTO): Set<Background> {
  return new Set(
    repository.vimColorSchemes.flatMap(colorscheme => colorscheme.backgrounds),
  );
}

function matchesBackground(
  repository: RepositoryDTO,
  backgroundFilter?: BackgroundFilter,
): boolean {
  if (!backgroundFilter) {
    return true;
  }

  const backgrounds = getRepositoryBackgrounds(repository);

  if (backgroundFilter === 'both') {
    return backgrounds.has('light') && backgrounds.has('dark');
  }

  return backgrounds.has(backgroundFilter);
}

function getRepositorySearchFields(
  repository: RepositoryDTO,
): RepositorySearchFields {
  const owner = normalize(repository.owner.name);
  const name = normalize(repository.name);

  return {
    owner,
    name,
    key: `${owner}/${name}`,
    description: normalize(repository.description),
    colorschemeNames: repository.vimColorSchemes.map(colorscheme =>
      normalize(colorscheme.name),
    ),
  };
}

function scoreToken(fields: RepositorySearchFields, token: string): number {
  const { key, owner, name, colorschemeNames, description } = fields;

  if (key === token || owner === token || name === token) {
    return 100;
  }

  if (
    key.startsWith(token) ||
    owner.startsWith(token) ||
    name.startsWith(token)
  ) {
    return 80;
  }

  if (key.includes(token) || owner.includes(token) || name.includes(token)) {
    return 60;
  }

  if (
    colorschemeNames.some(colorschemeName => colorschemeName.includes(token))
  ) {
    return 40;
  }

  if (description.includes(token)) {
    return 20;
  }

  return 0;
}

function scoreRepository(
  repository: RepositoryDTO,
  tokens: string[],
): number | null {
  const fields = getRepositorySearchFields(repository);
  let score = 0;

  for (const token of tokens) {
    const tokenScore = scoreToken(fields, token);

    if (tokenScore === 0) {
      return null;
    }

    score += tokenScore;
  }

  return score;
}

function sortRepositories(a: RepositoryDTO, b: RepositoryDTO, sort: Sort) {
  switch (sort) {
    case SortOptions.Top:
      return b.stargazersCount - a.stargazersCount;
    case SortOptions.New:
      return (
        new Date(b.githubCreatedAt).getTime() -
        new Date(a.githubCreatedAt).getTime()
      );
    case SortOptions.Old:
      return (
        new Date(a.githubCreatedAt).getTime() -
        new Date(b.githubCreatedAt).getTime()
      );
    case SortOptions.Trending:
    default:
      return b.weekStargazersCount - a.weekStargazersCount;
  }
}

function searchRepositories({
  repositories,
  query,
  sort,
  filter,
  page,
  pageSize,
}: SearchRepositoriesParams): SearchRepositoriesResult {
  const tokens = getSearchTokens(query);

  if (!tokens.length) {
    return { repositories: [], count: 0, hasMore: false };
  }

  const scoredRepositories: ScoredRepository[] = [];

  for (const repository of repositories) {
    if (!matchesBackground(repository, filter.background)) {
      continue;
    }

    const score = scoreRepository(repository, tokens);
    if (score == null) {
      continue;
    }

    scoredRepositories.push({ repository, score });
  }

  scoredRepositories.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }

    const sortResult = sortRepositories(a.repository, b.repository, sort);
    if (sortResult !== 0) {
      return sortResult;
    }

    return `${a.repository.owner.name}/${a.repository.name}`.localeCompare(
      `${b.repository.owner.name}/${b.repository.name}`,
    );
  });

  const count = scoredRepositories.length;
  const visibleCount = page * pageSize;

  return {
    repositories: scoredRepositories
      .slice(0, visibleCount)
      .map(({ repository }) => repository),
    count,
    hasMore: count > visibleCount,
  };
}

export const RepositorySearchHelper = {
  getSearchTokens,
  searchRepositories,
};

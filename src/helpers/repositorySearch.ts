import { RepositoryDTO } from '@/models/DTO/repository';

import { Background } from '@/lib/backgrounds';
import type { Filter } from '@/lib/filter';
import type { Sort } from '@/lib/sort';
import { SortOptions } from '@/lib/sort';

type SearchRepositoriesParams = {
  repositories: RepositoryDTO[];
  query: string;
  sort: Sort;
  filter: Filter;
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

function normalize(value: string): string {
  return value.toLocaleLowerCase();
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

function matchesBackground(repository: RepositoryDTO, filter: Filter): boolean {
  if (!filter.background) {
    return true;
  }

  const backgrounds = getRepositoryBackgrounds(repository);

  if (filter.background === 'both') {
    return backgrounds.has('light') && backgrounds.has('dark');
  }

  return backgrounds.has(filter.background);
}

function scoreToken(repository: RepositoryDTO, token: string): number {
  const owner = normalize(repository.owner.name);
  const name = normalize(repository.name);
  const key = `${owner}/${name}`;
  const description = normalize(repository.description);
  const colorschemeNames = repository.vimColorSchemes.map(colorscheme =>
    normalize(colorscheme.name),
  );

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
  let score = 0;

  for (const token of tokens) {
    const tokenScore = scoreToken(repository, token);

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

  const scoredRepositories = repositories.reduce<ScoredRepository[]>(
    (matches, repository) => {
      if (!matchesBackground(repository, filter)) {
        return matches;
      }

      const score = scoreRepository(repository, tokens);
      if (score == null) {
        return matches;
      }

      matches.push({ repository, score });
      return matches;
    },
    [],
  );

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

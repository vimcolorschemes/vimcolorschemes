import type { Filter } from '@/lib/filter';
import type { Sort } from '@/lib/sort';
import { SortOptions } from '@/lib/sort';

const LIGHT_EXISTS = `r.has_light = 1`;
const DARK_EXISTS = `r.has_dark = 1`;

type FilterSQL = {
  joins: string[];
  clauses: string[];
  params: (string | number | null)[];
};

function getFilterSQL(filter: Filter): FilterSQL {
  const joins: string[] = [];
  const clauses: string[] = [];
  const params: (string | number | null)[] = [];

  if (filter.background === 'light') {
    clauses.push(LIGHT_EXISTS);
  } else if (filter.background === 'dark') {
    clauses.push(DARK_EXISTS);
  } else if (filter.background === 'both') {
    clauses.push(LIGHT_EXISTS);
    clauses.push(DARK_EXISTS);
  }

  if (filter.owner) {
    clauses.push(`r.owner_name = ? COLLATE NOCASE`);
    params.push(filter.owner);
  }

  return { joins, clauses, params };
}

function getSortSQL(sort: Sort): string {
  switch (sort) {
    case SortOptions.Trending:
      return 'r.week_stargazers_count DESC, r.id';
    case SortOptions.Top:
      return 'r.stargazers_count DESC, r.id';
    case SortOptions.New:
      return 'r.github_created_at DESC, r.id DESC';
    case SortOptions.Old:
      return 'r.github_created_at ASC, r.id';
    default:
      return 'r.week_stargazers_count DESC, r.id';
  }
}

export const QueryHelper = { getFilterSQL, getSortSQL };

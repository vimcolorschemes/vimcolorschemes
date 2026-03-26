import type { Filter } from '@/lib/filter';
import type { Sort } from '@/lib/sort';
import { SortOptions } from '@/lib/sort';

const LIGHT_EXISTS = `EXISTS (SELECT 1 FROM colorschemes cs JOIN colorscheme_groups csg ON csg.colorscheme_id = cs.id WHERE cs.repository_id = r.id AND csg.background = 'light')`;
const DARK_EXISTS = `EXISTS (SELECT 1 FROM colorschemes cs JOIN colorscheme_groups csg ON csg.colorscheme_id = cs.id WHERE cs.repository_id = r.id AND csg.background = 'dark')`;

type FilterSQL = {
  clauses: string[];
  params: (string | number | null)[];
};

function getFilterSQL(filter: Filter): FilterSQL {
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

  if (filter.search) {
    const words = filter.search.split(/[^\w]/).filter(Boolean);
    for (const word of words) {
      clauses.push(
        `(r.name LIKE ? OR r.owner_name LIKE ? OR r.description LIKE ?)`,
      );
      const like = `%${word}%`;
      params.push(like, like, like);
    }
  }

  if (filter.owner) {
    clauses.push(`r.owner_name = ? COLLATE NOCASE`);
    params.push(filter.owner);
  }

  return { clauses, params };
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

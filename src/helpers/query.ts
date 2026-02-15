import Filter from '@/lib/filter';
import Sort, { SortOptions } from '@/lib/sort';

type FilterQuery = Record<string, string | number | boolean | object>;

const REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g;

export function escapeRegex(value: string): string {
  return value.replace(REGEX_ESCAPE_PATTERN, '\\$&');
}

function getFilterQuery(filter: Filter): FilterQuery {
  const query = getSearchFilterQuery(filter.search);

  if (filter.background === 'light') {
    query['vimColorSchemes.backgrounds'] = 'light';
  }
  if (filter.background === 'dark') {
    query['vimColorSchemes.backgrounds'] = 'dark';
  }
  if (filter.owner) {
    const owner = escapeRegex(filter.owner);
    query['owner.name'] = { $regex: `^${owner}$`, $options: 'i' };
  }

  return query;
}

function getSearchFilterQuery(searchTerm?: string): FilterQuery {
  if (!searchTerm) {
    return {};
  }

  const words = searchTerm.split(/[^\w]/).filter(Boolean);

  return {
    $and: words.map(word => ({
      $or: [
        { name: { $regex: escapeRegex(word), $options: 'i' } },
        { 'owner.name': { $regex: escapeRegex(word), $options: 'i' } },
        { description: { $regex: escapeRegex(word), $options: 'i' } },
      ],
    })),
  };
}

function getSortQuery(sort: Sort): Record<string, 1 | -1> {
  switch (sort) {
    case SortOptions.Trending:
      return { weekStargazersCount: -1, _id: 1 };
    case SortOptions.Top:
      return { stargazersCount: -1, _id: 1 };
    case SortOptions.New:
      return { githubCreatedAt: -1, _id: 1 };
    case SortOptions.Old:
      return { githubCreatedAt: 1, _id: 1 };
    default:
      return { weekStargazersCount: -1, _id: 1 };
  }
}

const QueryHelper = { getFilterQuery, getSortQuery };
export default QueryHelper;

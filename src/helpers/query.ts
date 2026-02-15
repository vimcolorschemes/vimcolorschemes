import Filter from '@/lib/filter';
import Sort, { SortOptions } from '@/lib/sort';

type FilterQuery = Record<string, string | number | boolean | object>;

function getFilterQuery(filter: Filter): FilterQuery {
  const query = getSearchFilterQuery(filter.search);

  if (filter.background === 'both') {
    query['vimColorSchemes.backgrounds'] = { $all: ['light', 'dark'] };
  }
  if (filter.background === 'light') {
    query['vimColorSchemes.backgrounds'] = 'light';
  }
  if (filter.background === 'dark') {
    query['vimColorSchemes.backgrounds'] = 'dark';
  }
  if (filter.owner) {
    query['owner.name'] = { $regex: `^${filter.owner}$`, $options: 'i' };
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
        { name: { $regex: word, $options: 'i' } },
        { 'owner.name': { $regex: word, $options: 'i' } },
        { description: { $regex: word, $options: 'i' } },
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

import Editors from '@/lib/editors';
import Filter from '@/lib/filter';
import Sort, { SortOptions } from '@/lib/sort';

type FilterQuery = Record<string, string | number | boolean | object>;

function getFilterQuery(filter: Filter): FilterQuery {
  const query = getSearchFilterQuery(filter.search);
  if (filter.editor === Editors.Vim) {
    query['vimColorSchemes.isLua'] = false;
  }
  if (filter.editor === Editors.Neovim) {
    query['vimColorSchemes.isLua'] = true;
  }

  if (filter.background === 'light') {
    query['vimColorSchemes.backgrounds'] = 'light';
  }
  if (filter.background === 'dark') {
    query['vimColorSchemes.backgrounds'] = 'dark';
  }

  return query;
}

function getSearchFilterQuery(term?: string): FilterQuery {
  if (!term) return {};

  return {
    $or: [
      { name: { $regex: term, $options: 'i' } },
      { 'owner.name': { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { 'vimColorSchemes.name': { $regex: term, $options: 'i' } },
    ],
  };
}

function getSortQuery(sort: Sort): Record<string, 1 | -1> {
  switch (sort) {
    case SortOptions.Trending:
      return { weekStargazersCount: -1 };
    case SortOptions.Top:
      return { stargazersCount: -1 };
    case SortOptions.RecentlyUpdated:
      return { lastCommitAt: -1 };
    case SortOptions.New:
      return { githubCreatedAt: -1 };
    case SortOptions.Old:
      return { githubCreatedAt: 1 };
    default:
      return { weekStargazersCount: -1 };
  }
}

const QueryHelper = { getFilterQuery, getSortQuery };
export default QueryHelper;

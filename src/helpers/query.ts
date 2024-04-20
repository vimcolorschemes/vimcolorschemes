import { SortOrder } from 'mongoose';

import Engines from '@/lib/engines';
import Filter from '@/lib/filter';
import Sort, { SortOptions, SortOrders } from '@/lib/sort';

type FilterQuery = Record<string, string | number | boolean | object>;

function getFilterQuery(filter: Filter): FilterQuery {
  const query = getSearchFilterQuery(filter.search);
  if (filter.engine === Engines.Vim) {
    query['vimColorSchemes.isLua'] = false;
  }
  if (filter.engine === Engines.Neovim) {
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

type SortQuery = { [key: string]: SortOrder };

function getSortQuery(sort: Sort): SortQuery {
  switch (sort) {
    case SortOptions.Trending:
      return { weekStargazersCount: SortOrders.Descending };
    case SortOptions.Top:
      return { stargazersCount: SortOrders.Descending };
    case SortOptions.RecentlyUpdated:
      return { lastCommitAt: SortOrders.Descending };
    case SortOptions.New:
      return { githubCreatedAt: SortOrders.Descending };
    case SortOptions.Old:
      return { githubCreatedAt: SortOrders.Ascending };
    default:
      return { weekStargazersCount: SortOrders.Descending };
  }
}

const QueryHelper = { getFilterQuery, getSortQuery };
export default QueryHelper;

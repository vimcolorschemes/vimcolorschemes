import Backgrounds, { Background } from '@/lib/backgrounds';
import Engines, { Engine } from '@/lib/engines';
import Filter, {
  URLFilterKey,
  URLKeyFilterMap,
  FilterURLKeyMap,
  URLFilterKeys,
} from '@/lib/filter';

import URLHelper from './url';

/**
 * Generate the URL from a filter object.
 *
 * @example
 * FilterHelper.getURLFromFilter({ engine: 'vim', background: 'dark' }) === 'e.vim/b.dark'
 * FilterHelper.getURLFromFilter({ engine: 'vim', background: 'invalid' }) === 'e.vim'
 *
 * @param filter The filter object.
 * @returns The URL.
 */
function getURLFromFilter(filter: Filter): string {
  return Object.entries(filter)
    .map(([key, value]) => {
      if (value == null) {
        return null;
      }

      const urlKey = FilterURLKeyMap[key as keyof Filter];
      if (!Object.values(URLFilterKeys).includes(urlKey as URLFilterKey)) {
        return null;
      }

      if (urlKey === URLFilterKeys.Engine && !isValidEngine(value)) {
        return null;
      }

      if (urlKey === URLFilterKeys.Background && !isValidBackground(value)) {
        return null;
      }

      if (
        urlKey === URLFilterKeys.Page &&
        (!isValidPage(value) || value === 1)
      ) {
        return null;
      }

      if (urlKey === URLFilterKeys.Search) {
        return `${urlKey}.${URLHelper.encode(value)}`;
      }

      return `${urlKey}.${value}`;
    })
    .filter(Boolean)
    .sort()
    .join('/');
}

/**
 * Build a filter object from URL parts.
 *
 * @example
 * FilterHelper.getFilterFromURL(['e.vim', 'b.dark']) === { engine: 'vim', background: 'dark' }
 * FilterHelper.getFilterFromURL(['e.vim', 'i.invalid']) === { engine: 'vim' }
 *
 * @param filters
 * @returns
 */
function getFilterFromURL(filters: string[]): Filter {
  return filters.reduce((filter, part) => {
    const [key, value] = part.split('.');
    if (!value) {
      return filter;
    }

    const filterKey = URLKeyFilterMap[key as URLFilterKey];
    if (!filterKey) {
      return filter;
    }

    if (filterKey in filter) {
      return filter;
    }

    if (filterKey === 'engine' && !isValidEngine(value)) {
      return filter;
    }

    if (filterKey === 'background' && !isValidBackground(value)) {
      return filter;
    }

    if (filterKey === 'page') {
      return isValidPage(value)
        ? { ...filter, page: parseInt(value, 10) }
        : filter;
    }

    if (filterKey === 'search') {
      return { ...filter, search: URLHelper.decode(value) };
    }

    return { ...filter, [filterKey]: value };
  }, {});
}

function isValidEngine(value: string | number): boolean {
  return Object.values(Engines).includes(value as Engine);
}

function isValidBackground(value: string | number): boolean {
  return Object.values(Backgrounds).includes(value as Background);
}

function isValidPage(value: string | number): boolean {
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return !isNaN(parsed) && parsed >= 1;
  }
  return value >= 1;
}

const FilterHelper = { getFilterFromURL, getURLFromFilter };
export default FilterHelper;

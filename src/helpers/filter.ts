import Backgrounds, { Background } from '@/lib/backgrounds';
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
 * FilterHelper.getURLFromFilter({ background: 'dark' }) === 'b.dark'
 * FilterHelper.getURLFromFilter({ background: 'invalid' }) === ''
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
        return `${urlKey}.${URLHelper.encode(value as string)}`;
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
 * FilterHelper.getFilterFromURL(['b.dark']) === { background: 'dark' }
 * FilterHelper.getFilterFromURL(['i.invalid']) === {}
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

    if (filterKey === 'background' && !isValidBackground(value)) {
      return filter;
    }

    if (filterKey === 'page') {
      return isValidPage(value) && value !== '1'
        ? { ...filter, page: parseInt(value, 10) }
        : filter;
    }

    if (filterKey === 'search') {
      return { ...filter, search: URLHelper.decode(value) };
    }

    return { ...filter, [filterKey]: value };
  }, {});
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

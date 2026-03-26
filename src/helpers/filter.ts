import { Backgrounds, Background } from '@/lib/backgrounds';
import {
  type Filter,
  type URLFilterKey,
  URLKeyFilterMap,
  FilterURLKeyMap,
  URLFilterKeys,
} from '@/lib/filter';

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
      if (
        !urlKey ||
        !Object.values(URLFilterKeys).includes(urlKey as URLFilterKey)
      ) {
        return null;
      }

      if (urlKey === URLFilterKeys.Background && !isValidBackground(value)) {
        return null;
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

    return { ...filter, [filterKey]: value };
  }, {});
}

function isValidBackground(value: string | number): boolean {
  return (
    value === 'both' || Object.values(Backgrounds).includes(value as Background)
  );
}

export const FilterHelper = { getFilterFromURL, getURLFromFilter };

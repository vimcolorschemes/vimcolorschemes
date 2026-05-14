import { Backgrounds, type Background } from '@/lib/backgrounds';
import type { BackgroundFilter } from '@/lib/filter';
import type { PageContext } from '@/lib/pageContext';
import type { Sort } from '@/lib/sort';
import { SortOptions } from '@/lib/sort';

import { FilterHelper } from '@/helpers/filter';

type SearchParamSource =
  | Record<string, string | string[] | undefined>
  | { get(name: string): string | null };

function getSearchParam(
  searchParams: SearchParamSource,
  name: string,
): string | undefined {
  if (typeof (searchParams as { get?: unknown }).get === 'function') {
    const reader = searchParams as { get(name: string): string | null };
    return reader.get(name) ?? undefined;
  }

  const value = (searchParams as Record<string, string | string[] | undefined>)[
    name
  ];
  return Array.isArray(value) ? value[0] : value;
}

function getSort(sort: string | undefined): Sort {
  if (Object.values(SortOptions).includes(sort as Sort)) {
    return sort as Sort;
  }

  return SortOptions.Trending;
}

function getBackground(
  background: string | undefined,
): BackgroundFilter | undefined {
  if (background === 'both') {
    return background;
  }

  if (Object.values(Backgrounds).includes(background as Background)) {
    return background as BackgroundFilter;
  }

  return undefined;
}

/**
 * Get the context of the index page from the URL.
 *
 * @example
 * PageContextHelper.get(['trending', 'b.dark ]) === { sort: 'trending', filter: { background: 'dark' } };
 *
 * @param pathnameParams
 * @returns
 */
function get(pathnameParams: string[]): PageContext {
  const [sort, ...filters] = pathnameParams as [Sort, ...string[]];
  const filter = FilterHelper.getFilterFromURL(filters);
  return { sort, filter };
}

function getFromSearchParams(searchParams: SearchParamSource): PageContext {
  const background = getBackground(getSearchParam(searchParams, 'background'));
  const filter = background ? { background } : {};

  return {
    sort: getSort(getSearchParam(searchParams, 'sort')),
    filter,
  };
}

/**
 * Generate a page title from the index page context.
 *
 * @example
 * PageContextHelper.getPageTitle({ sort: 'trending', filter: { background: 'dark' } }) === 'trending dark colorschemes';
 *
 * @param pageContext The index page context including the current sort and filter.
 * @returns The page title.
 */
function getPageTitle({ filter, sort }: PageContext): string {
  const parts: string[] = [sort];
  if (filter.background) {
    if (filter.background === 'both') {
      parts.push('light and dark');
    } else {
      parts.push(filter.background);
    }
  }
  parts.push('colorschemes');
  return parts.join(' ');
}

function isHomepage({ filter, sort }: PageContext): boolean {
  return sort === SortOptions.Trending && !filter.background;
}

export const PageContextHelper = {
  get,
  getFromSearchParams,
  getPageTitle,
  isHomepage,
};

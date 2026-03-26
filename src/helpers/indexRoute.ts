import type { PageContext } from '@/lib/pageContext';

import { FilterHelper } from '@/helpers/filter';

type IndexRouteState = {
  filters: string[];
  search: string;
};

export function getIndexRouteState(pathname: string): IndexRouteState {
  const segments = pathname.split('/').filter(Boolean);
  const indexRouteStart = segments.indexOf('i');
  const routeSegments =
    indexRouteStart === -1 ? segments : segments.slice(indexRouteStart + 1);
  const searchSegment = routeSegments.at(-1);

  if (!searchSegment?.startsWith('s.')) {
    return { filters: routeSegments, search: '' };
  }

  return {
    filters: routeSegments.slice(0, -1),
    search: decodeURIComponent(searchSegment.slice(2)),
  };
}

export function buildIndexRoutePath(
  pageContext: PageContext,
  search?: string,
): string {
  const filterURL = FilterHelper.getURLFromFilter(pageContext.filter);
  const segments = ['/i', pageContext.sort];

  if (filterURL) {
    segments.push(filterURL);
  }

  const trimmedSearch = search?.trim();

  if (trimmedSearch) {
    segments.push(`s.${encodeURIComponent(trimmedSearch)}`);
  }

  return segments.join('/');
}

import { Backgrounds } from '@/lib/backgrounds';
import type { BackgroundFilter } from '@/lib/filter';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import { FilterHelper } from '@/helpers/filter';

type IndexRouteStaticParam = { filters: string[] };

export function buildIndexRoutePath(pageContext: PageContext): string {
  const filterURL = FilterHelper.getURLFromFilter(pageContext.filter);
  const segments = ['/i', pageContext.sort];

  if (filterURL) {
    segments.push(filterURL);
  }

  return segments.join('/');
}

export function buildIndexRouteStaticParams(): IndexRouteStaticParam[] {
  const backgrounds: (BackgroundFilter | undefined)[] = [
    undefined,
    Backgrounds.Dark,
    Backgrounds.Light,
    'both',
  ];

  return Object.values(SortOptions).flatMap(sort =>
    backgrounds.map(background => {
      const filterURL = FilterHelper.getURLFromFilter(
        background ? { background } : {},
      );
      const filters = filterURL ? [sort, filterURL] : [sort];
      return { filters };
    }),
  );
}

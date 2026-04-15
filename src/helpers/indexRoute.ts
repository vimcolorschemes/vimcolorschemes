import type { PageContext } from '@/lib/pageContext';

import { FilterHelper } from '@/helpers/filter';

export function buildIndexRoutePath(pageContext: PageContext): string {
  const filterURL = FilterHelper.getURLFromFilter(pageContext.filter);
  const segments = ['/i', pageContext.sort];

  if (filterURL) {
    segments.push(filterURL);
  }

  return segments.join('/');
}

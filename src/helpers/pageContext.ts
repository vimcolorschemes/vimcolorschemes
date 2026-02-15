import PageContext from '@/lib/pageContext';
import Sort from '@/lib/sort';

import FilterHelper from '@/helpers/filter';

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

const PageContextHelper = { get, getPageTitle };
export default PageContextHelper;

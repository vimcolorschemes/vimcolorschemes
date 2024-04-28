import PageContext from '@/lib/pageContext';
import Sort from '@/lib/sort';

import FilterHelper from './filter';
import SortHelper from './sort';

/**
 * Get the context of the index page from the URL.
 *
 * @example
 * PageContextHelper.get(['trending', 'e.vim', 'b.dark ]) === { sort: 'trending', filter: { background: 'dark', editor: 'vim' } };
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
 * PageContextHelper.getPageTitle({ sort: 'trending', filter: { background: 'dark', editor: 'vim' } }) === 'trending dark vim colorschemes';
 *
 * @param pageContext The index page context including the current sort and filter.
 * @returns The page title.
 */
function getPageTitle({ filter, sort }: PageContext): string {
  const parts: string[] = [SortHelper.getLabel(sort)];
  if (filter.background) {
    parts.push(filter.background);
  }
  if (filter.editor) {
    parts.push(filter.editor);
  }
  parts.push('colorschemes');
  return parts.join(' ');
}

const PageContextHelper = { get, getPageTitle };
export default PageContextHelper;

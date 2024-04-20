import IndexPageContext from '@/lib/indexPageContext';
import Sort from '@/lib/sort';

import FilterHelper from './filter';

/**
 * Get the context of the index page from the URL.
 *
 * @example
 * PageContextHelper.get(['trending', 'e.vim', 'b.dark ]) === { sort: 'trending', filter: { background: 'dark', editor: 'vim' } };
 *
 * @param pathnameParams
 * @returns
 */
function get(pathnameParams: string[]): IndexPageContext {
  const [sort, ...filters] = pathnameParams as [Sort, ...string[]];
  const filter = FilterHelper.getFilterFromURL(filters);
  return { sort, filter };
}

const PageContextHelper = { get };
export default PageContextHelper;

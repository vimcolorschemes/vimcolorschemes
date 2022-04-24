import { Action, Actions } from '../lib/actions';

/**
 * Adds query parameters to a URL
 * @param {string} url - The string value to use as a URL
 * @param {Object} [queryParams] - The query parameters to append to the URL
 * @returns {string} The completed formatted URL
 */
function applyQueryParams(
  url: string,
  queryParams?: Record<string, any>,
): string {
  if (!queryParams) {
    return url;
  }

  let formattedUrl = new URL(url);

  formattedUrl = Object.keys(queryParams).reduce((url, key) => {
    url.searchParams.append(key, queryParams[key]);
    return url;
  }, formattedUrl);

  return formattedUrl.href;
}

/**
 * Make a string value safe to use as a URL
 * @param {string} value - The string value to use as a URL
 * @returns {string} The URLified string value
 */
function urlify(value: string): string {
  if (!value) {
    return '';
  }

  return value.trim().replace(/\s/g, '%20').toLowerCase();
}

/**
 * Based on a base route and a page number, return a fully formed pathname to redirect to
 * @param {string} route - The base route name
 * @param {number} page - The page number to add to the pathname
 * @returns {string} The formed pathname
 */
function paginateRoute(route: string, page: number): string {
  if (route == null || typeof route !== 'string') {
    route = '/';
  }

  if (!page || typeof page !== 'number' || page < 1) {
    page = 1;
  }

  let pagePath = '';
  if (page > 1) {
    pagePath = 'page/' + page;
  }

  let routePath = route;
  if (!!pagePath && !route.endsWith('/')) {
    routePath = route + '/';
  }

  return routePath + pagePath;
}

/**
 * Returns the current page as specified by the URL pathname
 * @param {string} pathname - The current URL pathname
 * @returns {number} The current page
 */
function getPageFromURL(pathname: string): number {
  const expression = /\/page\/(\d+)/;
  const matches = pathname.match(expression);

  if (matches == null || matches.length < 2) {
    return 1;
  }

  try {
    const page = Number.parseInt(matches[1]);
    return page > 0 ? page : 1;
  } catch {
    return 1;
  }
}

/**
 * Returns the current action as specified by the URL pathname
 * @param {string} pathname - The current URL pathname
 * @returns {Object} The current action
 */
function getActionFromURL(pathname: string): Action {
  const match = Object.values(Actions)
    .filter(action => action !== Actions.Trending)
    .find(action => pathname.includes(action.route));

  if (match == null) {
    return Actions.Trending;
  }

  return match;
}

const URLHelper = {
  applyQueryParams,
  getActionFromURL,
  getPageFromURL,
  paginateRoute,
  urlify,
};

export default URLHelper;

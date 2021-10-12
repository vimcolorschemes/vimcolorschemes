import { Action, Actions } from '../lib/actions';

/**
 * Make a string value safe to use as a URL
 * @param {string} value - The string value to use as a URL
 * @returns {string} The URLified string value
 */
function URLify(value: string): string {
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
  if (pagePath && !route.endsWith('/')) {
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
    return Number.parseInt(matches[1]);
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
  URLify,
  paginateRoute,
  getActionFromURL,
  getPageFromURL,
};

export default URLHelper;

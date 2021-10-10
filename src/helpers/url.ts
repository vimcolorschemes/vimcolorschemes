/**
 * Make a string value safe to use as a URL
 * @param {string} value - The string value to use as a URL
 * @return {string} The URLified string value
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
 * @return {string} The formed pathname
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

const URLHelper = {
  URLify,
  paginateRoute,
};

export default URLHelper;

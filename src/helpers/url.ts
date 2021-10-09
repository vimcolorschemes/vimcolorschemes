const URLHelper = {
  URLify: function (value: string): string {
    if (!value) {
      return '';
    }

    return value.trim().replace(/\s/g, '%20').toLowerCase();
  },
  paginateRoute: function (route: string, page: number | null): string {
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
  },
};

export default URLHelper;

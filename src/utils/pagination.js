export const paginateRoute = (route, page) => {
  if (!route) route = "/";
  if (!page) page = 1;

  const routePath = route.endsWith("/") ? route : `${route}/`;
  const pagePath = page > 1 ? `page/${page}` : "";
  return `${routePath}${pagePath}`;
};

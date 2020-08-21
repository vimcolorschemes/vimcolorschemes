export const paginateRoute = (route = "/", page = 1) => {
  if (page === 1) return route;
  return `${route.endsWith("/") ? route : `${route}/`}page/${page}`;
};

export const paginateRoute = (route, page) => {
  if (route == null || typeof route !== "string") route = "/";
  if (!page || typeof page !== "number" || page < 1) page = 1;

  const pagePath = page > 1 ? `page/${page}` : "";
  const routePath = pagePath && !route.endsWith("/") ? `${route}/` : route;
  return `${routePath}${pagePath}`;
};

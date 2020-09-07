export const ACTIONS = {
  TRENDING: {
    label: "Trending",
    route: "/",
    field: "week_stargazers_count",
    order: "DESC",
  },
  MOST_POPULAR: {
    label: "Most popular",
    route: "/most-popular",
    field: "stargazers_count",
    order: "DESC",
  },
  RECENTLY_UPDATED: {
    label: "Most recently updated",
    route: "/recently-updated",
    field: "last_commit_at",
    order: "DESC",
  },
  NEWEST: {
    label: "Newest",
    route: "/newest",
    field: "github_created_at",
    order: "DESC",
  },
  OLDEST: {
    label: "Oldest",
    route: "/oldest",
    field: "github_created_at",
    order: "ASC",
  },
};

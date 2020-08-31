export const ACTIONS = {
  DEFAULT: {
    label: "Most popular",
    route: "/",
    field: "stargazers_count",
    order: "DESC",
    default: true,
  },
  SORT_BY_UPDATED_DESC: {
    label: "Most recently updated",
    route: "/recently-updated",
    field: "last_commit_at",
    order: "DESC",
  },
  SORT_BY_CREATED_DESC: {
    label: "Newest",
    route: "/newest",
    field: "github_created_at",
    order: "DESC",
  },
  SORT_BY_CREATED_ASC: {
    label: "Oldest",
    route: "/oldest",
    field: "github_created_at",
    order: "ASC",
  },
  SORT_BY_WEEK_STARS: {
    label: "Rising",
    route: "/rising",
    field: "week_stargazers_count",
    order: "DESC",
  },
};

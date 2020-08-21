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
    route: "/updated/desc",
    field: "last_commit_at",
    order: "DESC",
  },
  SORT_BY_CREATED_DESC: {
    label: "Newest",
    route: "/created/desc",
    field: "github_created_at",
    order: "DESC",
  },
  SORT_BY_CREATED_ASC: {
    label: "Oldest",
    route: "/created/asc",
    field: "github_created_at",
    order: "ASC",
  },
};

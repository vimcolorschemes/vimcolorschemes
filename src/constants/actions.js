export const ACTIONS = {
  TRENDING: {
    label: "Trending",
    route: "/",
    field: "week_stargazers_count",
    order: "DESC",
  },
  TOP: {
    label: "Top",
    route: "/top",
    field: "stargazers_count",
    order: "DESC",
  },
  RECENTLY_UPDATED: {
    label: "Recently updated",
    route: "/recently-updated",
    field: "last_commit_at",
    order: "DESC",
  },
  NEW: {
    label: "New",
    route: "/new",
    field: "github_created_at",
    order: "DESC",
  },
  OLD: {
    label: "Old",
    route: "/old",
    field: "github_created_at",
    order: "ASC",
  },
};

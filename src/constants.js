export const ACTIONS = {
  DEFAULT: {
    label: "Most popular",
    route: "/",
  },
  SORT_BY_STARS_ASC: {
    label: "Least popular",
    route: "/stars/asc/",
  },
  SORT_BY_UPDATED_DESC: {
    label: "Most recently updated",
    route: "/updated/desc/",
  },
  SORT_BY_UPDATED_ASC: {
    label: "Least recently updated",
    route: "/updated/asc/",
  },
  SORT_BY_CREATED_ASC: {
    label: "Oldest",
    route: "/created/asc/",
  },
  SORT_BY_CREATED_DESC: {
    label: "Newest",
    route: "/created/desc/",
  },
};

export const LAYOUTS = {
  LIST: "list",
  GRID: "grid",
  BLOCK: "block",
};

export const KEYS = {
  SPACE: " ",
  ENTER: "Enter",
  TOP: "g",
  BOTTOM: "G",
  LEFT: "h",
  DOWN: "j",
  UP: "k",
  RIGHT: "l",
  BACK: "H",
};

export const NON_NAVIGATION_KEYS = [KEYS.SPACE, KEYS.ENTER];

export const SECTIONS = {
  // general
  NAV: "nav",

  // repositories
  ACTIONS: "actions",
  REPOSITORIES: "repositories",
  PAGINATION: "pagination",

  // repository
  REPOSITORY_HEADER: "repository_header",
  REPOSITORY_MAIN_IMAGE: "repository_main_image",
  REPOSITORY_MOSAIC: "repository_mosaic",
  REPOSITORY_NAV: "repository_nav",
};

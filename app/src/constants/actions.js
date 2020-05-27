export const ACTIONS = {
  DEFAULT: {
    label: "Most starred",
    route: "/",
  },
  SORT_BY_STARS_ASC: {
    label: "Least starred",
    route: "/stars/asc/",
  },
  SORT_BY_UPDATED_ASC: {
    label: "Updated least recently",
    route: "/updated/asc/",
  },
  SORT_BY_UPDATED_DESC: {
    label: "Updated most recently",
    route: "/updated/desc/",
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

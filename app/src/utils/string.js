export const URLify = value =>
  !!value ? value.trim().replace(/\s/g, "%20").toLowerCase() : "";

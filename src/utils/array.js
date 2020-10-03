export const excludeItems = (items, excludedItems) =>
  items.filter(item => !excludedItems.includes(item));

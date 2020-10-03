export const excludeItems = (items, excludedItems) => {
  if (!items || !items.length) return [];
  if (!excludedItems || !excludedItems.length) return items;

  return items.filter(item => !excludedItems.includes(item));
};

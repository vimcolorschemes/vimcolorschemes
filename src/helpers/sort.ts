import Sort from '@/lib/sort';

/**
 * Get the label corresponding to the sort option
 *
 * @example
 * SortHelper.getLabel('trending') === 'trending';
 * SortHelper.getLabel('recently-updated') === 'recently updated';
 *
 * @param sort The sort option
 * @returns The label
 */
function getLabel(sort: Sort): string {
  return sort.replace(/[^a-zA-Z]/g, ' ');
}

const SortHelper = { getLabel };
export default SortHelper;

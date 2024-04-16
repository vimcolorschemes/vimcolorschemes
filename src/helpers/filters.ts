import Filter, { FilterOptionMap } from '@/lib/filter';

/**
 * Build a filter object from an array of values coming from the URL.
 *
 * @example
 * FiltersHelper.getFilter(['e.vim', 'b.dark']) === { 'vimColorSchemes.isLua': false, 'vimColorSchemes.background': 'dark' }
 *
 * @param values The values from the URL.
 * @returns The filter object.
 */
function getFilter(values: string[]): Filter {
  return values
    .map(value => FilterOptionMap[value])
    .filter(Boolean)
    .reduce((acc, filter) => ({ ...acc, ...filter }), {});
}

const FiltersHelper = { getFilter };
export default FiltersHelper;

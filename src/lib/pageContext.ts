import type { Filter } from './filter';
import type { Sort } from './sort';

export type PageContext = {
  sort: Sort;
  filter: Filter;
};

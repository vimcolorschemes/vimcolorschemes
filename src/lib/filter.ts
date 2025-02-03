import { Background } from './backgrounds';

export const URLFilterKeys = {
  Background: 'b',
  Search: 's',
  Page: 'p',
} as const;
export type URLFilterKey = (typeof URLFilterKeys)[keyof typeof URLFilterKeys];

export const FilterURLKeyMap: Record<keyof Filter, URLFilterKey> = {
  background: URLFilterKeys.Background,
  search: URLFilterKeys.Search,
  page: URLFilterKeys.Page,
};

export const URLKeyFilterMap: Record<URLFilterKey, keyof Filter> = {
  [URLFilterKeys.Background]: 'background',
  [URLFilterKeys.Search]: 'search',
  [URLFilterKeys.Page]: 'page',
};

type Filter = {
  background?: Background;
  search?: string;
  page?: number;
};

export default Filter;

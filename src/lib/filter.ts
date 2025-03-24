import { Background } from './backgrounds';

export const URLFilterKeys = {
  Background: 'b',
  Search: 's',
  Page: 'p',
  Owner: 'a',
} as const;
export type URLFilterKey = (typeof URLFilterKeys)[keyof typeof URLFilterKeys];

export const FilterURLKeyMap: Record<keyof Filter, URLFilterKey> = {
  background: URLFilterKeys.Background,
  search: URLFilterKeys.Search,
  page: URLFilterKeys.Page,
  owner: URLFilterKeys.Search,
};

export const URLKeyFilterMap: Record<URLFilterKey, keyof Filter> = {
  [URLFilterKeys.Background]: 'background',
  [URLFilterKeys.Search]: 'search',
  [URLFilterKeys.Page]: 'page',
  [URLFilterKeys.Owner]: 'owner',
};

type Filter = {
  background?: Background;
  search?: string;
  page?: number;
  owner?: string;
};

export default Filter;

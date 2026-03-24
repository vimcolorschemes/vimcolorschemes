import { Background } from './backgrounds';

export const URLFilterKeys = {
  Background: 'b',
  Owner: 'a',
} as const;
export type URLFilterKey = (typeof URLFilterKeys)[keyof typeof URLFilterKeys];

export const FilterURLKeyMap: Partial<Record<keyof Filter, URLFilterKey>> = {
  background: URLFilterKeys.Background,
  owner: URLFilterKeys.Owner,
};

export const URLKeyFilterMap: Record<URLFilterKey, keyof Filter> = {
  [URLFilterKeys.Background]: 'background',
  [URLFilterKeys.Owner]: 'owner',
};

export type BackgroundFilter = Background | 'both';

type Filter = {
  background?: BackgroundFilter;
  search?: string;
  page?: number;
  owner?: string;
};

export default Filter;

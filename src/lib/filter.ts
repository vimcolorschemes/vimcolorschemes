import { Background } from './backgrounds';
import { Engine } from './engines';

export const URLFilterKeys = {
  Engine: 'e',
  Background: 'b',
  Search: 's',
} as const;
export type URLFilterKey = (typeof URLFilterKeys)[keyof typeof URLFilterKeys];

export const FilterURLKeyMap: Record<keyof Filter, URLFilterKey> = {
  engine: URLFilterKeys.Engine,
  background: URLFilterKeys.Background,
  search: URLFilterKeys.Search,
};

export const URLKeyFilterMap: Record<URLFilterKey, keyof Filter> = {
  [URLFilterKeys.Engine]: 'engine',
  [URLFilterKeys.Background]: 'background',
  [URLFilterKeys.Search]: 'search',
};

type Filter = {
  engine?: Engine;
  background?: Background;
  search?: string;
};

export default Filter;

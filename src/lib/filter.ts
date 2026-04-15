import { Background } from './backgrounds';

export const URLFilterKeys = {
  Background: 'b',
} as const;
export type URLFilterKey = (typeof URLFilterKeys)[keyof typeof URLFilterKeys];

export const FilterURLKeyMap: Partial<Record<keyof Filter, URLFilterKey>> = {
  background: URLFilterKeys.Background,
};

export const URLKeyFilterMap: Record<URLFilterKey, keyof Filter> = {
  [URLFilterKeys.Background]: 'background',
};

export type BackgroundFilter = Background | 'both';

export type Filter = {
  background?: BackgroundFilter;
  page?: number;
  owner?: string;
};

import { Background } from './backgrounds';
import { Editor } from './editors';

export const URLFilterKeys = {
  Editor: 'e',
  Background: 'b',
  Search: 's',
  Page: 'p',
} as const;
export type URLFilterKey = (typeof URLFilterKeys)[keyof typeof URLFilterKeys];

export const FilterURLKeyMap: Record<keyof Filter, URLFilterKey> = {
  editor: URLFilterKeys.Editor,
  background: URLFilterKeys.Background,
  search: URLFilterKeys.Search,
  page: URLFilterKeys.Page,
};

export const URLKeyFilterMap: Record<URLFilterKey, keyof Filter> = {
  [URLFilterKeys.Editor]: 'editor',
  [URLFilterKeys.Background]: 'background',
  [URLFilterKeys.Search]: 'search',
  [URLFilterKeys.Page]: 'page',
};

type Filter = {
  editor?: Editor;
  background?: Background;
  search?: string;
  page?: number;
};

export default Filter;

import { Repository } from './models/repository';

export const REPOSITORY_COUNT_PER_PAGE = 20;

export interface Action {
  label: string;
  route: string;
  property: keyof Repository;
  order: 'asc' | 'desc';
}

export const Actions: Record<string, Action> = {
  trending: {
    label: 'Trending',
    route: '/',
    property: 'weekStargazersCount',
    order: 'desc',
  },
  top: {
    label: 'Top',
    route: '/top',
    property: 'lastCommitAt',
    order: 'desc',
  },
  recentlyUpdated: {
    label: 'Recently updated',
    route: '/recently-updated',
    property: 'lastCommitAt',
    order: 'desc',
  },
  new: {
    label: 'New',
    route: '/new',
    property: 'githubCreatedAt',
    order: 'desc',
  },
  old: {
    label: 'Old',
    route: '/old',
    property: 'githubCreatedAt',
    order: 'asc',
  },
};

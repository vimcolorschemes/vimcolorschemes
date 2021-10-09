import { Repository } from './repository';

export interface Action {
  label: string;
  route: string;
  property: keyof Repository;
  order: 'ASC' | 'DESC';
}

export const Actions: Record<string, Action> = {
  trending: {
    label: 'Trending',
    route: '/',
    property: 'weekStargazersCount',
    order: 'DESC',
  },
  top: {
    label: 'Top',
    route: '/top',
    property: 'lastCommitAt',
    order: 'DESC',
  },
  recentlyUpdated: {
    label: 'Recently updated',
    route: '/recently-updated',
    property: 'lastCommitAt',
    order: 'DESC',
  },
  new: {
    label: 'New',
    route: '/new',
    property: 'githubCreatedAt',
    order: 'DESC',
  },
  old: {
    label: 'Old',
    route: '/old',
    property: 'githubCreatedAt',
    order: 'ASC',
  },
};

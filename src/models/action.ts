import Routes from '@/routes';
import { Repository } from './repository';

export interface Action {
  label: string;
  route: string;
  property: keyof Repository;
  order: 'ASC' | 'DESC';
}

export const Actions: Record<string, Action> = {
  Trending: {
    label: 'Trending',
    route: Routes.Home,
    property: 'weekStargazersCount',
    order: 'DESC',
  },
  Top: {
    label: 'Top',
    route: Routes.Top,
    property: 'lastCommitAt',
    order: 'DESC',
  },
  RecentlyUpdated: {
    label: 'Recently updated',
    route: Routes.RecentlyUpdated,
    property: 'lastCommitAt',
    order: 'DESC',
  },
  New: {
    label: 'New',
    route: Routes.New,
    property: 'githubCreatedAt',
    order: 'DESC',
  },
  Old: {
    label: 'Old',
    route: Routes.Old,
    property: 'githubCreatedAt',
    order: 'ASC',
  },
};

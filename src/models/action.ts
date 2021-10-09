import Routes from '../routes';
import { Repository } from './repository';

export interface Action {
  label: string;
  route: string;
  property: keyof Repository;
  order: 'ASC' | 'DESC';
}

enum ActionNames {
  Trending = 'Trending',
  Top = 'Top',
  RecentlyUpdated = 'RecentlyUpdated',
  New = 'New',
  Old = 'Old',
}

export const Actions: Record<ActionNames, Action> = {
  [ActionNames.Trending]: {
    label: 'Trending',
    route: Routes.Home,
    property: 'weekStargazersCount',
    order: 'DESC',
  },
  [ActionNames.Top]: {
    label: 'Top',
    route: Routes.Top,
    property: 'lastCommitAt',
    order: 'DESC',
  },
  [ActionNames.RecentlyUpdated]: {
    label: 'Recently updated',
    route: Routes.RecentlyUpdated,
    property: 'lastCommitAt',
    order: 'DESC',
  },
  [ActionNames.New]: {
    label: 'New',
    route: Routes.New,
    property: 'githubCreatedAt',
    order: 'DESC',
  },
  [ActionNames.Old]: {
    label: 'Old',
    route: Routes.Old,
    property: 'githubCreatedAt',
    order: 'ASC',
  },
};

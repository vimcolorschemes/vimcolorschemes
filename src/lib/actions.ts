import Routes from './routes';
import { Repository } from '../models/repository';

export interface Action {
  label: string;
  route: string;
  property: keyof Repository;
  order: 'ASC' | 'DESC';
}

enum ActionName {
  Trending = 'Trending',
  Top = 'Top',
  RecentlyUpdated = 'RecentlyUpdated',
  New = 'New',
  Old = 'Old',
}

export const Actions: Record<ActionName, Action> = {
  [ActionName.Trending]: {
    label: 'Trending',
    route: Routes.Home,
    property: 'weekStargazersCount',
    order: 'DESC',
  },
  [ActionName.Top]: {
    label: 'Top',
    route: Routes.Top,
    property: 'stargazersCount',
    order: 'DESC',
  },
  [ActionName.RecentlyUpdated]: {
    label: 'Recently updated',
    route: Routes.RecentlyUpdated,
    property: 'lastCommitAt',
    order: 'DESC',
  },
  [ActionName.New]: {
    label: 'New',
    route: Routes.New,
    property: 'githubCreatedAt',
    order: 'DESC',
  },
  [ActionName.Old]: {
    label: 'Old',
    route: Routes.Old,
    property: 'githubCreatedAt',
    order: 'ASC',
  },
};

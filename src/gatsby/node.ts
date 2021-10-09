import path from 'path';

import URLHelper from '../helpers/url';
import { Actions } from '../models/action';
import {
  RepositoryPageContext,
  RepositoriesPageContext,
  REPOSITORY_COUNT_PER_PAGE,
} from '../models/repository';

export function onCreateWebpackConfig({ actions }) {
  actions.setWebpackConfig({
    resolve: {
      alias: { '@': path.resolve('src') },
      extensions: ['ts', 'tsx'],
    },
  });
}

interface PageInput {
  path: string;
  component: string;
  layout?: string;
  context?: RepositoryPageContext | RepositoriesPageContext;
}

const createRepositoryPages = (
  repositories: any[],
  createPage: (page: PageInput) => void,
) => {
  repositories.forEach(repository => {
    const key = `${repository.owner.name}/${repository.name}`;
    const repositoryPath = URLHelper.URLify(key);
    createPage({
      path: repositoryPath,
      component: path.resolve('src/templates/repository/index.tsx'),
      context: {
        ownerName: repository.owner.name,
        name: repository.name,
      },
    });
  });
};

const createRepositoriesPages = (
  repositories: any[],
  createPage: (page: PageInput) => void,
) => {
  const pageCount = Math.ceil(repositories.length / REPOSITORY_COUNT_PER_PAGE);
  Array.from({ length: pageCount }).forEach((_, index) => {
    const page = index + 1;
    Object.values(Actions).forEach(action => {
      createPage({
        path: URLHelper.paginateRoute(action.route, page),
        component: path.resolve('src/templates/repositories/index.tsx'),
        context: {
          skip: index * REPOSITORY_COUNT_PER_PAGE,
          limit: REPOSITORY_COUNT_PER_PAGE,
          sortProperty: [action.property],
          sortOrder: [action.order],
          pageCount,
          currentPage: page,
        },
      });
    });
  });
};

const repositoriesQuery = `
{
  repositoriesData: allMongodbVimcolorschemesRepositories(
    filter: { updateValid: { eq: true }, generateValid: { eq: true } }
  ) {
    nodes {
      name
      owner {
        name
      }
    }
  }
}
`;

export async function createPages({ graphql, actions: { createPage } }) {
  const { data } = await graphql(repositoriesQuery);
  const repositories = data.repositoriesData.nodes;

  createRepositoryPages(repositories, createPage);
  createRepositoriesPages(repositories, createPage);
}

import path from 'path';

import { REPOSITORY_COUNT_PER_PAGE, Actions } from '../constants';

import { Repository } from '../models/repository';

import { URLify, paginateRoute } from '../helpers/url';

export function onCreateWebpackConfig({ actions }) {
  actions.setWebpackConfig({
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  });
}

interface PageInput {
  path: string;
  component: string;
  layout?: string;
  context?: any;
}

const createRepositoryPages = (
  repositories: Repository[],
  createPage: (page: PageInput) => void,
) => {
  repositories.forEach(repository => {
    const ownerName = repository.owner ? repository.owner.name : '';
    const { name } = repository;
    const repositoryPath = URLify(`${ownerName}/${name}`);
    createPage({
      path: repositoryPath,
      component: path.resolve('src/pages/repository/index.tsx'),
      context: {
        ownerName,
        name,
      },
    });
  });
};

const createRepositoriesPages = (
  repositories: Repository[],
  createPage: (page: PageInput) => void,
) => {
  const pageCount = Math.ceil(repositories.length / REPOSITORY_COUNT_PER_PAGE);
  Array.from({ length: pageCount }).forEach((_, index) => {
    const page = index + 1;
    Object.values(Actions).forEach(action =>
      createPage({
        path: paginateRoute(action.route, page),
        component: path.resolve('src/pages/index.tsx'),
        context: {
          skip: index * REPOSITORY_COUNT_PER_PAGE,
          limit: REPOSITORY_COUNT_PER_PAGE,
          sortProperty: [action.property],
          sortOrder: [action.order],
          pageCount,
          currentPage: page,
        },
      }),
    );
  });
};

const repositoriesQuery = `
  {
    allMongodbVimcolorschemesRepositories(filter: { valid: { eq: true } }) {
      nodes {
        id
        name
        owner {
          name
        }
        description
        githubCreatedAt
        lastCommitAt
        stargazersCount
        weekStargazersCount
      }
    }
  }
`;

export async function createPages({ graphql, actions: { createPage } }) {
  const { data } = await graphql(repositoriesQuery);
  const { nodes: repositories } = data.allMongodbVimcolorschemesRepositories;

  createRepositoryPages(repositories, createPage);
  createRepositoriesPages(repositories, createPage);
}

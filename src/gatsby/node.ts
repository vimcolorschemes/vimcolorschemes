import path from 'path';

import ElasticSearchClient from '../services/elasticSearch';
import EnumHelper from '../helpers/enum';
import URLHelper from '../helpers/url';
import generatePreviewImages from './preview';
import { APIRepository } from '../models/api';
import { Actions } from '../lib/actions';
import { Background } from '../lib/background';
import {
  Repository,
  RepositoryPageContext,
  RepositoriesPageContext,
  REPOSITORY_COUNT_PER_PAGE,
} from '../models/repository';

const isSearchUp =
  !!process.env.GATSBY_ELASTIC_SEARCH_URL ||
  !!process.env.GATSBY_ELASTIC_SEARCH_CLOUD_ID;

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

function createRepositoryPages(
  repositories: Repository[],
  createPage: (page: PageInput) => void,
) {
  repositories.forEach(repository =>
    createPage({
      path: repository.route,
      component: path.resolve('src/templates/repository/index.tsx'),
      context: {
        ownerName: repository.owner.name,
        name: repository.name,
      },
    }),
  );
}

async function createRepositoryPreviewPages(
  apiRepositories: Repository[],
  createPage: (page: PageInput) => void,
): Promise<void> {
  apiRepositories.forEach(repository =>
    createPage({
      path: repository.previewRoute,
      component: path.resolve('src/templates/preview/index.tsx'),
      context: {
        ownerName: repository.owner.name,
        name: repository.name,
      },
    }),
  );
}

function createRepositoriesPages(
  repositories: Repository[],
  createPage: (page: PageInput) => void,
) {
  const pageCount = Math.ceil(repositories.length / REPOSITORY_COUNT_PER_PAGE);
  Array.from({ length: pageCount }).forEach((_, index) => {
    const page = index + 1;
    EnumHelper.getKeys(Background).forEach(filterKey => {
      const filter = Background[filterKey];
      const filterPath = `/${filter}`;
      Object.values(Actions).forEach(action => {
        createPage({
          path: filterPath + URLHelper.paginateRoute(action.route, page),
          component: path.resolve('src/templates/repositories/index.tsx'),
          context: {
            skip: index * REPOSITORY_COUNT_PER_PAGE,
            limit: REPOSITORY_COUNT_PER_PAGE,
            sortProperty: [action.property],
            sortOrder: [action.order],
            pageCount,
            currentPage: page,
            filters: [filter],
          },
        });
      });
    });

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
          filters: [Background.Light, Background.Dark],
        },
      });
    });
  });
}

const repositoriesQuery = `
{
  repositoriesData: allMongodbVimcolorschemesRepositories(
    filter: {
      updateValid: { eq: true }
      generateValid: { eq: true }
      vimColorSchemes: { elemMatch: { valid: { eq: true } } }
    }
  ) {
    apiRepositories: nodes {
      name
      description
      stargazersCount
      githubCreatedAt
      lastCommitAt
      githubURL
      weekStargazersCount
      owner {
        name
      }
      vimColorSchemes {
        name
        valid
        data {
          light {
            name
            hexCode
          }
          dark {
            name
            hexCode
          }
        }
      }
    }
  }
}
`;

export async function createPages({ graphql, actions: { createPage } }) {
  const { data } = await graphql(repositoriesQuery);
  const repositories = data.repositoriesData.apiRepositories.map(
    (apiRepository: APIRepository) => new Repository(apiRepository),
  );

  createRepositoryPages(repositories, createPage);
  createRepositoryPreviewPages(repositories, createPage);

  createRepositoriesPages(repositories, createPage);

  if (isSearchUp) {
    const elasticSearchClient = new ElasticSearchClient();
    const result = await elasticSearchClient.indexRepositories(repositories);
    console.log('Search Index result:', result);
  }
}

export async function onPostBuild({ graphql }) {
  const { data } = await graphql(repositoriesQuery);
  const repositories: Repository[] = data.repositoriesData.apiRepositories.map(
    (apiRepository: APIRepository) => new Repository(apiRepository),
  );

  await generatePreviewImages(repositories);
}

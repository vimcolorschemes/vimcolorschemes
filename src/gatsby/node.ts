import ElasticSearchClient from '../services/elasticSearch';
import path from 'path';
import puppeteer from 'puppeteer';

import URLHelper from '../helpers/url';
import EmojiHelper from '../helpers/emoji';
import { APIRepository } from '../models/api';
import { Actions } from '../lib/actions';
import {
  Repository,
  RepositoryPageContext,
  RepositoriesPageContext,
  REPOSITORY_COUNT_PER_PAGE,
} from '../models/repository';
import { APIRepository } from '../models/api';

const isSearchUp =
  !!process.env.GATSBY_ELASTIC_SEARCH_URL ||
  !!process.env.GATSBY_ELASTIC_SEARCH_CLOUD_ID;

const REPOSITORY_NODE_TYPE = 'mongodbVimcolorschemesRepositories';

export function onCreateWebpackConfig({ actions }) {
  actions.setWebpackConfig({
    resolve: {
      alias: { '@': path.resolve('src') },
      extensions: ['ts', 'tsx'],
    },
  });
}

export function onCreateNode({ node }) {
  if (node.internal.type === REPOSITORY_NODE_TYPE) {
    node.description = EmojiHelper.convertColonEmojis(node.description);
  }
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
      component: path.resolve('src/templates/repository/index.tsx'),
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

async function createPreviewImages(
  apiRepositories: Repository[],
): Promise<void> {
  apiRepositories.forEach(async repository => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(repository.previewRoute);
    await page.screenshot({
      path: repository.previewImagePath,
      clip: {
        x: 0,
        y: 0,
        width: 400,
        height: 200,
      },
    });
    await browser.close();
  });
}

export async function createPages({ graphql, actions: { createPage } }) {
  const { data } = await graphql(repositoriesQuery);
  const repositories = data.repositoriesData.apiRepositories.map(
    (apiRepository: APIRepository) => new Repository(apiRepository),
  );

  createRepositoryPages(repositories, createPage);
  createRepositoryPreviewPages(repositories, createPage);

  createRepositoriesPages(repositories, createPage);

  createPreviewImages(repositories);

  if (isSearchUp) {
    const elasticSearchClient = new ElasticSearchClient();
    const result = await elasticSearchClient.indexRepositories(repositories);
    console.log('Search Index result:', result);
  }
}

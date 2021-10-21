import fs from 'fs';
import http from 'http';
import nodeStatic from 'node-static';
import path from 'path';
import puppeteer from 'puppeteer';

import ElasticSearchClient from '../services/elasticSearch';
import EmojiHelper from '../helpers/emoji';
import URLHelper from '../helpers/url';
import { APIRepository } from '../models/api';
import { Actions } from '../lib/actions';
import {
  Repository,
  RepositoryPageContext,
  RepositoriesPageContext,
  REPOSITORY_COUNT_PER_PAGE,
} from '../models/repository';

const BUILD_PATH = 'public';
const PREVIEW_WIDTH = 800;
const PREVIEW_HEIGHT = 348;
const PREVIEW_PORT = 8080;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

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
  const build = new nodeStatic.Server('public');

  http
    .createServer((req, res) => {
      build.serve(req, res);
    })
    .listen(PREVIEW_PORT);

  const { data } = await graphql(repositoriesQuery);
  const repositories: Repository[] = data.repositoriesData.apiRepositories.map(
    (apiRepository: APIRepository) => new Repository(apiRepository),
  );

  repositories.forEach(async repository => {
    try {
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          `--window-size=${PREVIEW_WIDTH},${PREVIEW_HEIGHT}`,
        ],
      });
      const page = await browser.newPage();
      await page.goto(`${PREVIEW_URL}${repository.previewRoute}`);

      const previewPath = BUILD_PATH + repository.previewImageRoute;
      const previewDirectory = path.dirname(previewPath);

      if (!fs.existsSync(previewDirectory)) {
        fs.mkdirSync(previewDirectory, { recursive: true });
      }

      await page.screenshot({
        path: previewPath,
        clip: {
          x: 0,
          y: 0,
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
        },
      });
      await browser.close();
    } catch (error) {
      console.error(error);
    }
  });
}

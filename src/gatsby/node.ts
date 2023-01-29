import path from 'path';

import Background from '../lib/background';
import EnumHelper from '../helpers/enum';
import SearchService from '../services/search';
import URLHelper from '../helpers/url';
import generatePreviewImages from './preview';
import { APIRepository } from '../models/api';
import { Action, Actions } from '../lib/actions';
import {
  Repository,
  RepositoryPageContext,
  RepositoriesPageContext,
  REPOSITORY_COUNT_PER_PAGE,
} from '../models/repository';

const isSearchActive =
  !!process.env.GATSBY_IS_SEARCH_ACTIVE &&
  !!process.env.GATSBY_SEARCH_INDEX_URL &&
  !!process.env.SEARCH_INDEX_API_KEY &&
  !!process.env.SEARCH_INDEX_S3_BUCKET &&
  !!process.env.AWS_S3_ACCESS_KEY_ID &&
  !!process.env.AWS_S3_SECRET_ACCESS_KEY;

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

      const filteredRepositories = repositories.filter(repository =>
        repository.vimColorSchemes.some(
          vimColorScheme =>
            vimColorScheme.valid &&
            !!vimColorScheme.backgrounds.includes(filter),
        ),
      );
      const pageCount = Math.ceil(
        filteredRepositories.length / REPOSITORY_COUNT_PER_PAGE,
      );

      const filterPath = `/${filter}`;
      Object.values(Actions).forEach(action => {
        const pagePath =
          filterPath + URLHelper.paginateRoute(action.route, page);
        createRepositoriesPage({
          createPage,
          pagePath,
          index,
          page,
          pageCount,
          action,
          filters: [filter],
        });
      });
    });

    Object.values(Actions).forEach(action => {
      const pagePath = URLHelper.paginateRoute(action.route, page);
      createRepositoriesPage({
        createPage,
        pagePath,
        index,
        pageCount,
        action,
        page,
        filters: [Background.Light, Background.Dark],
      });
    });
  });
}

interface CreateRepositoriesPageProps {
  createPage: any;
  pagePath: string;
  index: number;
  page: number;
  pageCount: number;
  action: Action;
  filters: Background[];
}

function createRepositoriesPage({
  createPage,
  pagePath,
  index,
  page,
  pageCount,
  action,
  filters,
}: CreateRepositoriesPageProps) {
  createPage({
    path: pagePath,
    component: path.resolve('src/templates/repositories/index.tsx'),
    context: {
      skip: index * REPOSITORY_COUNT_PER_PAGE,
      limit: REPOSITORY_COUNT_PER_PAGE,
      sort: [{ [action.property]: action.order }],
      pageCount,
      currentPage: page,
      filters,
    },
  });
}

const repositoriesQuery = `
{
  repositoriesData: allMongodbVimcolorschemesRepositories(
    filter: {
      updateValid: { eq: true }
      generateValid: { eq: true }
      vimColorSchemes: {
        elemMatch: { valid: { eq: true } }
      }
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
      isVim
      isLua
      owner {
        name
      }
      vimColorSchemes {
        name
        valid
        backgrounds
        isLua
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

  if (!isSearchActive) {
    return;
  }

  try {
    const result = await SearchService.index(repositories);
    console.log(`Indexed ${result.count} repositories`);
  } catch (error) {
    console.error('Error indexing repositories', error);
  }
}

export async function onPostBuild({ graphql }) {
  const { data } = await graphql(repositoriesQuery);
  const repositories: Repository[] = data.repositoriesData.apiRepositories.map(
    (apiRepository: APIRepository) => new Repository(apiRepository),
  );

  await generatePreviewImages(repositories);
}

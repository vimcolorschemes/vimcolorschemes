import path from "path";

import { createRemoteFileNode } from "gatsby-source-filesystem";

import { URLify } from "./src/utils/string";
import { paginateRoute } from "./src/utils/pagination";
import Logger from "./src/utils/logger";

import { ACTIONS, REPOSITORY_COUNT_PER_PAGE } from "./src/constants";

const imagePromises = [];

export const createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type mongodbColorschemesRepositories implements Node {
      processed_featured_image: File @link
      processed_images: [File]
      week_stargazers_count: Int
    }
  `);
  Logger.info(
    "Adding processed image fields to mongodbColorschemesRepositories node",
  );
};

export const onCreateNode = ({
  node,
  actions: { createNode },
  store,
  cache,
  createNodeId,
}) => {
  if (
    node.internal.type === "mongodbColorschemesRepositories" &&
    !!node.valid
  ) {
    const WEEK_DAYS_COUNT = 7;
    if ((node.stargazers_count_history || []).length >= WEEK_DAYS_COUNT) {
      const { stargazers_count_history: history } = node;
      const weekStargazersHistory = history.slice(
        history.length - WEEK_DAYS_COUNT,
      );
      const diff =
        weekStargazersHistory[weekStargazersHistory.length - 1]
          .stargazers_count - weekStargazersHistory[0].stargazers_count;
      node.week_stargazers_count = diff;
    }
    if (node.image_urls && node.image_urls.length > 0) {
      const blacklistedImageUrls = node.blacklisted_image_urls || [];
      const validImageUrls = node.image_urls.filter(
        url => !blacklistedImageUrls.includes(url),
      );

      validImageUrls.forEach(async (url, index) => {
        if (blacklistedImageUrls.includes(url)) return;

        try {
          const promise = createRemoteFileNode({
            url,
            parentNodeId: node.id,
            createNode,
            createNodeId,
            cache,
            store,
          });
          imagePromises.push(promise);
          const fileNode = await promise;

          if (fileNode) {
            if (
              (index === 0 && !node.featured_image_url) ||
              node.featured_image_url === url
            )
              node.processed_featured_image = fileNode.id;
            else
              node.processed_images = [
                ...(node.processed_images || []),
                fileNode,
              ];
          }
        } catch (e) {
          Logger.error(e);
        }
      });
    }
  }
};

export const onPostBootstrap = async () => {
  try {
    const values = await Promise.allSettled(imagePromises);
    Logger.success(`Done processing all ${values.length} images`);
  } catch (e) {
    Logger.error(e);
  }
};

const createRepositoryPages = (repositories, createPage) => {
  repositories.forEach(repository => {
    const ownerName = repository.owner ? repository.owner.name : "oops";
    const { name } = repository;
    const repositoryPath = URLify(`${ownerName}/${name}`);
    createPage({
      path: repositoryPath,
      component: path.resolve(`./src/templates/repository/index.jsx`),
      context: {
        ownerName,
        name,
      },
    });
  });
};

const createRepositoriesPages = (repositories, createPage) => {
  const pageCount = Math.ceil(repositories.length / REPOSITORY_COUNT_PER_PAGE);
  Array.from({ length: pageCount }).forEach((_, index) => {
    const page = index + 1;
    Object.values(ACTIONS).forEach(action =>
      createPage({
        path: paginateRoute(action.route, page),
        component: path.resolve(`./src/templates/repositories/index.jsx`),
        context: {
          skip: index * REPOSITORY_COUNT_PER_PAGE,
          limit: REPOSITORY_COUNT_PER_PAGE,
          sortField: [action.field],
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
    allMongodbColorschemesRepositories(filter: {valid: { eq: true }, image_urls: { ne: "" }}) {
      nodes {
        name
        owner {
          name
        }
      }
    }
  }
`;

export const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const {
    data: {
      allMongodbColorschemesRepositories: { nodes: repositories },
    },
  } = await graphql(repositoriesQuery);

  createRepositoryPages(repositories, createPage);
  Logger.info("Creating repository pages");
  createRepositoriesPages(repositories, createPage);
  Logger.info("Creating repositories index pages");
};

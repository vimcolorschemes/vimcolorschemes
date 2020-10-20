import path from "path";

import { createRemoteFileNode } from "gatsby-source-filesystem";

import Logger from "./src/utils/logger";
import { URLify } from "./src/utils/string";
import { WEEK_DAYS_COUNT } from "./src/utils/date";
import { computeTrendingStargazersCount } from "./src/utils/repository";
import { convertColonEmojis } from "./src/utils/emoji";
import { paginateRoute } from "./src/utils/pagination";
import { excludeItems } from "./src/utils/array";

import {
  getRepositoryIndexClient,
  bulkIndexRepositories,
  deleteRepositoryIndex,
} from "./src/elasticsearch/client";

import { ACTIONS, REPOSITORY_COUNT_PER_PAGE } from "./src/constants";

const REPOSITORY_NODE_TYPE = "mongodbColorschemesRepositories";

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
    node.internal.type === REPOSITORY_NODE_TYPE &&
    !!node.valid &&
    !node.archived
  ) {
    node.week_stargazers_count = computeTrendingStargazersCount(
      node.stargazers_count_history,
      node.github_created_at,
      WEEK_DAYS_COUNT,
    );

    node.description = convertColonEmojis(node.description);

    if (node.image_urls && node.image_urls.length > 0) {
      const validImageUrls = excludeItems(
        node.image_urls,
        node.blacklisted_image_urls || [],
      );

      validImageUrls.forEach(async (url, index) => {
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
              node.featured_image_url === url ||
              (index === 0 && !node.featured_image_url)
            ) {
              node.processed_featured_image = fileNode.id;
            } else {
              node.processed_images = [
                ...(node.processed_images || []),
                fileNode,
              ];
            }
          }
        } catch (error) {
          Logger.error(error);
        }
      });
    }
  }
};

export const onPostBootstrap = async () => {
  try {
    const values = await Promise.allSettled(imagePromises);
    Logger.success(
      `Done creating remote file nodes for all ${values.length} images`,
    );
  } catch (e) {
    Logger.error(e);
  }
};

const createRepositoryPages = (repositories, createPage) => {
  repositories.forEach(repository => {
    const ownerName = repository.owner ? repository.owner.name : "";
    const { name } = repository;
    const repositoryPath = URLify(`${ownerName}/${name}`);
    createPage({
      path: repositoryPath,
      component: path.resolve("./src/templates/repository/index.jsx"),
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

const createSearchIndex = async repositories => {
  const client = getRepositoryIndexClient();

  Logger.info("Deleting repository search index");

  const deleteResult = await deleteRepositoryIndex(client);

  if (deleteResult.success) {
    Logger.info("Creating repositories search index");

    const indexResult = await bulkIndexRepositories(client, repositories);

    if (indexResult.success) Logger.info(indexResult.message);
    else
      Logger.error(`Error bulk indexing repositories: ${indexResult.message}`);
  } else {
    Logger.error(`Error while deleting search index: ${deleteResult.message}`);
  }
};

const repositoriesQuery = `
  {
    allMongodbColorschemesRepositories(filter: {valid: { eq: true },archived: {ne: true}, image_urls: { ne: "" }}) {
      nodes {
        id
        name
        owner {
          name
        }
        description
        createdAt: github_created_at
        lastCommitAt: last_commit_at
        stargazersCount: stargazers_count
        weekStargazersCount: week_stargazers_count
        featuredImage: processed_featured_image {
          childImageSharp {
            fluid {
              src
            }
          }
        }
        images: processed_images {
          childImageSharp {
            fluid {
              src
            }
          }
        }
      }
    }
  }
`;

export const createPages = async ({ graphql, actions }) => {
  await Promise.allSettled(imagePromises);

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

  if (
    process.env.GATSBY_ELASTICSEARCH_URL ||
    process.env.GATSBY_ELASTICSEARCH_CLOUD_ID
  )
    createSearchIndex(repositories);
};

import { createRemoteFileNode } from "gatsby-source-filesystem";

const COLORS = {
  DEFAULT: "\x1b[0m",
  BLUE: "\x1b[34m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  RED: "\x1b[31m",
};

const info = message =>
  console.log(`${COLORS.BLUE}info ${COLORS.DEFAULT}${message}`);

const success = message =>
  console.log(`${COLORS.GREEN}success ${COLORS.DEFAULT}${message}`);

const error = message =>
  console.log(`${COLORS.RED}error ${COLORS.DEFAULT}${message}`);

const createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type mongodbColorschemesRepositories implements Node {
      processed_featured_image: File @link
      processed_images: [File]
    }
  `);
  info("Adding processed image fields to mongodbColorschemesRepositories node");
};

const imagePromises = [];

const onCreateNode = ({
  node,
  actions: { createNode },
  store,
  cache,
  createNodeId,
}) => {
  if (
    node.internal.type === "mongodbColorschemesRepositories" &&
    !!node.valid &&
    node.image_urls &&
    node.image_urls.length > 0
  ) {
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
        error(e);
      }
    });
  }
};

const onPostBootstrap = async () => {
  try {
    const values = await Promise.allSettled(imagePromises);
    success(`Done processing all ${values.length} images`);
  } catch (e) {
    error(e);
  }
};

const path = require("path");

const URLify = value =>
  !!value ? value.trim().toLowerCase().replace(/\s/g, "%20") : "";

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

const REPOSITORY_COUNT_PER_PAGE = 20;
const createRepositoriesPages = (repositories, createPage) => {
  const pageCount = Math.ceil(repositories.length / REPOSITORY_COUNT_PER_PAGE);

  const sortOrders = [
    { value: "DESC", path: "desc/", isDefault: true },
    { value: "ASC", path: "asc/" },
  ];
  const sortableFields = [
    { fieldName: "stargazers_count", path: "stars/", isDefault: true },
    { fieldName: "last_commit_at", path: "updated/" },
    { fieldName: "github_created_at", path: "created/" },
  ];
  return Array.from({ length: pageCount }).map((_, index) => {
    sortableFields.forEach(field => {
      sortOrders.forEach(sortOrder => {
        const sortPath =
          field.isDefault && sortOrder.isDefault
            ? ""
            : `${field.path}${sortOrder.path}`;

        createPage({
          path: index === 0 ? `/${sortPath}` : `/${sortPath}page/${index + 1}`,
          component: path.resolve(`./src/templates/repositories/index.jsx`),
          context: {
            skip: index * REPOSITORY_COUNT_PER_PAGE,
            limit: REPOSITORY_COUNT_PER_PAGE,
            sortField: [field.fieldName],
            sortOrder: [sortOrder.value],
            pageCount,
            currentPage: index + 1,
          },
        });
      });
    });
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

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const {
    data: {
      allMongodbColorschemesRepositories: { nodes: repositories },
    },
  } = await graphql(repositoriesQuery);

  createRepositoryPages(repositories, createPage);
  info("Creating repository pages");
  createRepositoriesPages(repositories, createPage);
  info("Creating repositories index pages");
};

export {
  createSchemaCustomization,
  onCreateNode,
  onPostBootstrap,
  createPages,
};

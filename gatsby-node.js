const { createRemoteFileNode } = require("gatsby-source-filesystem");

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

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type mongodbVimcsRepositories implements Node {
      processed_featured_image: File @link
      processed_images: [File]
    }
  `);
  info("Adding processed image fields to mongodbVimcsRepositories node");
};

const imagePromises = [];

exports.onCreateNode = ({
  node,
  actions: { createNode },
  store,
  cache,
  createNodeId,
}) => {
  if (
    node.internal.type === "mongodbVimcsRepositories" &&
    !node.blacklisted &&
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

exports.onPostBootstrap = async () => {
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

const pageSize = 20;
const createRepositoryPaginatedPages = (repositories, createPage) => {
  const pageCount = Math.ceil(repositories.length / pageSize);

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
          path: index === 0 ? `/${sortPath}` : `/${sortPath}${index + 1}`,
          component: path.resolve(`./src/templates/repositories/index.jsx`),
          context: {
            skip: index * pageSize,
            limit: pageSize,
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
    allMongodbVimcsRepositories(filter: {blacklisted: { ne: true }}) {
      nodes {
        name
        owner {
          name
        }
      }
    }
  }
`;

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const {
    data: {
      allMongodbVimcsRepositories: { nodes: repositories },
    },
  } = await graphql(repositoriesQuery);

  createRepositoryPages(repositories, createPage);
  info("Creating repository pages");
  createRepositoryPaginatedPages(repositories, createPage);
  info("Creating repositories index pages");
};

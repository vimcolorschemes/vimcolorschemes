const { createRemoteFileNode } = require("gatsby-source-filesystem");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type mongodbVimcsRepositories implements Node {
      processed_featured_image: File @link
      processed_images: [File]
    }
  `);
};

exports.onCreateNode = ({
  node,
  actions: { createNode },
  store,
  cache,
  createNodeId,
}) => {
  if (
    node.internal.type === "mongodbVimcsRepositories" &&
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
        const fileNode = await createRemoteFileNode({
          url,
          parentNodeId: node.id,
          createNode,
          createNodeId,
          cache,
          store,
        });

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
          index++;
        }
      } catch (e) {
        console.error(e);
      }
    });
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
  createRepositoryPaginatedPages(repositories, createPage);
};

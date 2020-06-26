const dotenv = require("dotenv");

if (process.env.environment !== "production") dotenv.config();

const {
  awsAccessKeyId,
  awsSecretAccessKey,
  awsS3BucketName,
  awsS3ImportsDirectoryName,
  isProduction,
} = process.env;

const AWS = isProduction ? require("aws-sdk") : null;
if (AWS)
  AWS.config.update({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  });
const s3 = isProduction ? new AWS.S3() : null;

const listRemoteRepositories = async () => {
  try {
    const data = await s3
      .listObjects({
        Bucket: awsS3BucketName,
        Prefix: `${awsS3ImportsDirectoryName}/`,
      })
      .promise();

    const lastImport = data.Contents.filter(item =>
      item.Key.endsWith(".json"),
    ).sort((a, b) => b.Key - a.Key)[0];

    const importData = await s3
      .getObject({
        Bucket: awsS3BucketName,
        Key: lastImport.Key,
      })
      .promise();

    const importContent = JSON.parse(importData.Body.toString());

    return importContent.repositories || [];
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const listLocalRepositories = () => {
  const fs = require("fs");
  const directory = "../data/imports/";

  const fileNames = fs.readdirSync(directory) || [];

  const lastImport = fileNames
    .filter(fileName => fileName.endsWith(".json"))
    .sort((a, b) => b - a)[0];

  const content = JSON.parse(
    fs.readFileSync(`${directory}${lastImport}`, "utf8"),
  );

  console.log(content.repositories.length);
  return content.repositories;
};

const listRepositories = async () => {
  if (isProduction) {
    console.log("Fetching remote repositories...");
    return listRemoteRepositories();
  } else {
    console.log("Fetching local repositories...");
    return listLocalRepositories();
  }
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
  cache,
}) => {
  try {
    const cacheKey = "s3-repositories";
    let obj = await cache.get(cacheKey);

    let repositories = null;

    if (!obj) {
      obj = { created: Date.now() };
      repositories = await listRepositories();
      obj.data = repositories;
    } else if (Date.now() > obj.lastChecked + 3600000) {
      repositories = await listRepositories();
      obj.data = repositories;
    } else {
      console.log("INFO: Used nodes cache");
      repositories = obj.data;
    }
    obj.lastChecked = Date.now();

    await cache.set(cacheKey, obj);

    const { createNode } = actions;

    repositories.forEach(repository => {
      try {
        const nodeContent = JSON.stringify(repository);
        const nodeMeta = {
          id: createNodeId(`repository-${repository.id}`),
          parent: null,
          children: [],
          internal: {
            type: `Repository`,
            mediaType: `text/html`,
            content: nodeContent,
            contentDigest: createContentDigest(repository),
          },
        };
        const node = Object.assign({}, repository, nodeMeta);
        createNode(node);
      } catch (e) {
        console.error(`Couldn't create node for ${repository.id}`);
        console.error(e);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const { createRemoteFileNode } = require("gatsby-source-filesystem");
const fetch = require("node-fetch");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type Repository implements Node {
      featuredImage: File @link
      images: [File]
    }
  `);
};

const urlIsImage = async url => {
  try {
    const response = await fetch(url);
    if (!!response && response.ok) {
      const contentType = response.headers.get("Content-Type");
      return contentType.includes("image");
    }
    return false;
  } catch {
    return false;
  }
};

exports.onCreateNode = async ({
  node,
  actions: { createNode },
  store,
  cache,
  createNodeId,
}) => {
  const imageUrls = node.image_urls;
  if (
    node.internal.type === "Repository" &&
    imageUrls !== null &&
    imageUrls.length > 0
  ) {
    let index = 0;
    try {
      for (const imageUrl of imageUrls) {
        let fileNode = null;
        if (await urlIsImage(imageUrl)) {
          fileNode = await createRemoteFileNode({
            url: imageUrl,
            parentNodeId: node.id,
            createNode,
            createNodeId,
            cache,
            store,
          });
        }
        if (fileNode) {
          if (index === 0) node.featuredImage = fileNode.id;
          else node.images = [...(node.images || []), fileNode];
          index++;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
};

const path = require(`path`);

const URLify = value =>
  !!value ? value.trim().toLowerCase().replace(/\s/g, "%20") : "";

const allRepositoryQuery = `
    {
      allRepository {
        nodes {
          name
          owner {
            name
          }
        }
      }
    }
  `;

const createRepositoryPage = ({ allRepository }, createPage) => {
  return allRepository.nodes.map(repository =>
    createPage({
      path: `${URLify(repository.owner.name)}/${URLify(repository.name)}`,
      component: path.resolve(`./src/templates/repository/index.jsx`),
      context: {
        ownerName: repository.owner.name,
        name: repository.name,
      },
    }),
  );
};

const pageSize = 20;
const createRepositoryPaginatedPages = ({ allRepository }, createPage) => {
  const pageCount = Math.ceil(allRepository.nodes.length / pageSize);

  const sortOrders = [
    { value: "DESC", path: "desc/", isDefault: true },
    { value: "ASC", path: "asc/" },
  ];
  const sortableFields = [
    { fieldName: "stargazers_count", path: "stars/", isDefault: true },
    { fieldName: "latest_commit_at", path: "updated/" },
    { fieldName: "created_at", path: "created/" },
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

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const { data } = await graphql(allRepositoryQuery);

  createRepositoryPage(data, createPage);
  createRepositoryPaginatedPages(data, createPage);
};

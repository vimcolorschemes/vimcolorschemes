const dotenv = require("dotenv");

if (process.env.environment !== "production") dotenv.config();

const {
  awsAccessKeyId,
  awsSecretAccessKey,
  awsS3BucketName,
  awsS3DirectoryName,
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
  const data = await s3
    .listObjects({
      Bucket: awsS3BucketName,
      Prefix: `${awsS3DirectoryName}/`,
    })
    .promise();

  const repositoryPromises = data.Contents.filter(item =>
    item.Key.endsWith(".json"),
  ).map(async item => {
    try {
      const data = await s3
        .getObject({
          Bucket: awsS3BucketName,
          Key: item.Key,
        })
        .promise();
      return JSON.parse(data.Body.toString());
    } catch (e) {
      console.error(e);
      return undefined;
    }
  });

  const repositories =
    (await Promise.all(repositoryPromises)).filter(
      repository => !!repository,
    ) || [];
  return repositories;
};

const listLocalRepositories = () => {
  const fs = require("fs");
  const directory = "../data/";

  const fileNames = fs.readdirSync(directory) || [];

  const repositories = fileNames
    .filter(fileName => fileName.endsWith(".json"))
    .map(fileName => {
      const fileContent = fs.readFileSync(`${directory}${fileName}`, "utf8");
      return JSON.parse(fileContent);
    });

  return repositories;
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
    const firstImageUrls = imageUrls.slice(0, 7);

    let index = 0;
    try {
      for (const imageUrl of firstImageUrls) {
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

  return Array.from({ length: pageCount }).map((_, index) => {
    createPage({
      path: index === 0 ? "/" : `/${index + 1}`,
      component: path.resolve(`./src/templates/repositories/index.jsx`),
      context: {
        skip: index * pageSize,
        limit: pageSize,
        sortField: ["stargazers_count"],
        sortOrder: ["DESC"],
        pageCount,
        currentPage: index + 1,
      },
    });
    createPage({
      path: index === 0 ? "/stars/asc/" : `/stars/asc/${index + 1}`,
      component: path.resolve(`./src/templates/repositories/index.jsx`),
      context: {
        skip: index * pageSize,
        limit: pageSize,
        sortField: ["stargazers_count"],
        sortOrder: ["ASC"],
        pageCount,
        currentPage: index + 1,
      },
    });
    createPage({
      path: index === 0 ? "/updated/asc/" : `/updated/asc/${index + 1}`,
      component: path.resolve(`./src/templates/repositories/index.jsx`),
      context: {
        skip: index * pageSize,
        limit: pageSize,
        sortField: ["latest_commit_at"],
        sortOrder: ["ASC"],
        pageCount,
        currentPage: index + 1,
      },
    });
    createPage({
      path: index === 0 ? "/updated/desc/" : `/updated/desc/${index + 1}`,
      component: path.resolve(`./src/templates/repositories/index.jsx`),
      context: {
        skip: index * pageSize,
        limit: pageSize,
        sortField: ["latest_commit_at"],
        sortOrder: ["DESC"],
        pageCount,
        currentPage: index + 1,
      },
    });
  });
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const { data } = await graphql(allRepositoryQuery);

  createRepositoryPage(data, createPage);
  createRepositoryPaginatedPages(data, createPage);
};

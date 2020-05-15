const dotenv = require("dotenv");

if (process.env.environment !== "production") dotenv.config();

const {
  awsAccessKeyId,
  awsSecretAccessKey,
  awsS3BucketName,
  awsS3DirectoryName,
} = process.env;

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
});
const s3 = new AWS.S3();

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;

  try {
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

    const repositories = (await Promise.all(repositoryPromises)).filter(
      repository => !!repository,
    );

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
      image: File @link(from: "image___NODE")
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
  } catch (e) {
    console.log(e);
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
    try {
      let index = 0;
      let fileNode = null;
      let imageUrl = null;
      while (imageUrls.length > index && !fileNode) {
        imageUrl = imageUrls[index];
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
        index++;
      }
      if (fileNode) {
        node.image___NODE = fileNode.id;
      }
    } catch (e) {
      console.error(e);
    }
  }
};

const path = require(`path`);

const URLify = value =>
  !!value ? value.trim().toLowerCase().replace(/\s/g, "%20") : "";

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allRepository {
        nodes {
          name
          owner {
            name
          }
        }
      }
    }
  `);
  result.data.allRepository.nodes.forEach(repository => {
    createPage({
      path: `${URLify(repository.owner.name)}/${URLify(repository.name)}`,
      component: path.resolve(`./src/templates/repository/index.jsx`),
      context: {
        ownerName: repository.owner.name,
        name: repository.name,
      },
    });
  });
};

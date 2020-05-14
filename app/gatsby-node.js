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

const urlIsImage = async (url, callback) => {
  try {
    const response = await fetch(url);
    if (!!response && response.ok) {
      const contentType = response.headers.get("Content-Type");
      return callback(contentType.includes("image"));
    }
    return callback(false);
  } catch {
    return callback(false);
  }
};

const isImageUrl = url => {
  const regex = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|webp)$/;
  return !!url && url.match(regex);
};

exports.onCreateNode = ({
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
    const imageUrl = imageUrls[0];
    try {
      if (isImageUrl(imageUrl))
        urlIsImage(imageUrl, async exists => {
          if (exists) {
            let fileNode = await createRemoteFileNode({
              url: imageUrl,
              parentNodeId: node.id,
              createNode,
              createNodeId,
              cache,
              store,
            });
            if (fileNode) {
              node.image___NODE = fileNode.id;
            }
          }
        });
    } catch (e) {
      console.error(e);
    }
  }
};

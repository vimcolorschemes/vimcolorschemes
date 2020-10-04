import { Client } from "@elastic/elasticsearch";

import { REPOSITORY_INDEX_NAME } from ".";

const ELASTICSEARCH_URL = process.env.GATSBY_ELASTICSEARCH_URL;

export const getRepositoryIndexClient = () => {
  const client = new Client({ node: ELASTICSEARCH_URL });
  return client;
};

export const deleteRepositoryIndex = async client => {
  try {
    const { body: exists } = await client.indices.exists({
      index: REPOSITORY_INDEX_NAME,
    });
    if (exists) await client.indices.delete({ index: REPOSITORY_INDEX_NAME });
    return { success: true };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const bulkIndexRepositories = async (client, repositories) => {
  try {
    await client.indices.create(
      {
        index: REPOSITORY_INDEX_NAME,
        body: {
          mappings: {
            properties: {
              id: { type: "keyword" },
              name: { type: "keyword" },
            },
          },
        },
      },
      { ignore: 400 },
    );

    const body = repositories.flatMap(repository => [
      { index: { _index: REPOSITORY_INDEX_NAME } },
      repository,
    ]);

    const { body: bulkResponse } = await client.bulk({ refresh: true, body });

    if (bulkResponse.errors) {
      const erroredDocuments = [];
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            operation: body[i * 2],
            document: body[i * 2 + 1],
          });
        }
      });
    }

    const {
      body: { count },
    } = await client.count({
      index: REPOSITORY_INDEX_NAME,
    });
    return { success: true, message: `Indexed ${count} repositories` };
  } catch (error) {
    return { success: false, message: error };
  }
};

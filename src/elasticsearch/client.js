import { Client } from "@elastic/elasticsearch";

import { INDEX_NAME } from ".";

const CLOUD_ID = process.env.GATSBY_ELASTICSEARCH_CLOUD_ID;
const URL = process.env.GATSBY_ELASTICSEARCH_URL || "http://localhost:9200";
const USERNAME = process.env.GATSBY_ELASTICSEARCH_USERNAME;
const PASSWORD = process.env.GATSBY_ELASTICSEARCH_PASSWORD;

export const getRepositoryIndexClient = () => {
  const client = new Client({
    cloud: CLOUD_ID
      ? {
          id: CLOUD_ID,
        }
      : undefined,
    node: !CLOUD_ID ? URL : undefined,
    auth: {
      username: USERNAME,
      password: PASSWORD,
    },
  });
  return client;
};

export const deleteRepositoryIndex = async client => {
  try {
    const { body: exists } = await client.indices.exists({
      index: INDEX_NAME,
    });
    if (exists) await client.indices.delete({ index: INDEX_NAME });
    return { success: true };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const bulkIndexRepositories = async (client, repositories) => {
  try {
    await client.indices.create(
      {
        index: INDEX_NAME,
        body: {
          mappings: {
            properties: {
              id: { type: "keyword" },
              name: { type: "text" },
              owner: { type: "object" },
              description: { type: "text" },
            },
          },
        },
      },
      { ignore: 400 },
    );

    const body = repositories.flatMap(repository => [
      { index: { _index: INDEX_NAME } },
      repository,
    ]);

    await client.bulk({ refresh: true, body });

    const {
      body: { count },
    } = await client.count({
      index: INDEX_NAME,
    });
    return { success: true, message: `Indexed ${count} repositories` };
  } catch (error) {
    return { success: false, message: error };
  }
};

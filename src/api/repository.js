import { post } from ".";

import { INDEX_NAME } from "src/elasticsearch";

const URL = process.env.GATSBY_ELASTICSEARCH_PROXY_URL;

/**
 * Posts a search request to the repository search index
 *
 * @param {string} query The search input to match
 *
 * @returns {object[]} results The repositories matching the search input
 */
export const searchRepositories = async query => {
  try {
    const data = await post(`${URL}/${INDEX_NAME}/_search`, {
      query: {
        query_string: {
          query: `*${query}*`,
        },
      },
    });
    return data.hits.hits.map(hit => hit._source);
  } catch {
    return [];
  }
};

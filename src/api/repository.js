import { post } from ".";

import { INDEX_NAME } from "src/elasticsearch";

const URL = process.env.GATSBY_ELASTICSEARCH_PROXY_URL;

/**
 * Posts a search request to the repository search index
 *
 * @param {string} query The search input to match
 * @param {number} page The search page
 *
 * @returns {object[]} results The repositories matching the search input
 */
export const searchRepositories = async (query, page = 1) => {
  try {
    const data = await post(`${URL}/${INDEX_NAME}/_search`, {
      query: {
        query_string: {
          query: `*${query}*`,
        },
      },
      from: (page - 1) * 20,
      size: 20,
    });

    return {
      totalCount: data.hits.total.value,
      repositories: data.hits.hits.map(hit => hit._source),
    };
  } catch {
    return [];
  }
};

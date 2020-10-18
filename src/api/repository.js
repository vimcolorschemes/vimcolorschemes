import { post } from ".";

import { REPOSITORY_COUNT_PER_PAGE } from "src/constants";

import { INDEX_NAME } from "src/elasticsearch";

const URL = process.env.GATSBY_ELASTICSEARCH_PROXY_URL;

/**
 * Posts a search request to the repository search index
 *
 * @param {string} query The search input to match
 * @param {number} page The search page
 *
 * @returns {object} results The repositories, total count and page count
 * matching the search input
 */
export const searchRepositories = async (query, page = 1) => {
  const data = await post(`${URL}/${INDEX_NAME}/_search`, {
    query: {
      query_string: {
        query: `*${query}*`,
      },
    },
    from: (page - 1) * REPOSITORY_COUNT_PER_PAGE,
    size: REPOSITORY_COUNT_PER_PAGE,
  });

  const repositories = data.hits.hits.map(hit => hit._source);
  const totalCount = data.hits.total.value;

  return {
    totalCount,
    repositories,
    pageCount: Math.ceil(totalCount / REPOSITORY_COUNT_PER_PAGE),
  };
};

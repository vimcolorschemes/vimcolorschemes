import { INDEX_NAME } from ".";

const URL = process.env.GATSBY_ELASTICSEARCH_PROXY_URL;

export const searchRepositoryIndex = async query => {
  try {
    const response = await fetch(`${URL}/${INDEX_NAME}/_search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          query_string: {
            query: `*${query}*`,
          },
        },
      }),
    });
    const data = await response.json();
    return data.hits.hits.map(hit => hit._source);
  } catch {
    return [];
  }
};

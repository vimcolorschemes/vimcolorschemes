import { REPOSITORY_INDEX_NAME } from ".";

const API_URL = process.env.GATSBY_ELASTICSEARCH_API_URL;

export const isSearchIndexUp = async () => {
  if (!API_URL) return false;

  try {
    await fetch(API_URL);
    return true;
  } catch {
    return false;
  }
};

export const searchRepositoryIndex = async query => {
  try {
    const response = await fetch(
      `${API_URL}/${REPOSITORY_INDEX_NAME}/_search`,
      {
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
      },
    );
    const data = await response.json();
    return data.hits.hits.map(hit => hit._source);
  } catch {
    return [];
  }
};
